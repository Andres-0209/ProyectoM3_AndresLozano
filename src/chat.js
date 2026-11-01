import { isValidMessage, createMessage, toApiHistory, getErrorMessageForStatus, MAX_MESSAGE_LENGTH } from './utils.js';
import { CHARACTERS, CHARACTER_ORDER, DEFAULT_CHARACTER } from './characters.js';

// Endpoint de la Serverless Function (archivo api/functions.js)
const API_URL = '/api/functions';

// Tiempo máximo de espera de la respuesta del servidor (milisegundos)
const CLIENT_TIMEOUT = 20000;

// Estado del chat en memoria: una conversación por personaje.
// Se conserva al navegar entre vistas mientras no se recargue la página.
const conversations = {};

// Personaje cuya respuesta estamos esperando (null si no hay ninguna petición en curso).
// Solo se permite una petición a la vez para evitar envíos duplicados.
let waitingFor = null;

// Personaje activo en el chat (se conserva al volver a la pestaña Chat)
let activeCharacter = DEFAULT_CHARACTER;

// Devuelve la conversación de un personaje, creándola con su saludo la primera vez
function getConversation(characterId) {
    if (!conversations[characterId]) {
        conversations[characterId] = [createMessage('character', CHARACTERS[characterId].greeting)];
    }
    return conversations[characterId];
}

export function getActiveCharacter() {
    return activeCharacter;
}

// Crea el indicador de escritura animado del personaje (átomo, neurona o láser)
function createTypingIndicator(characterId) {
    const character = CHARACTERS[characterId];
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'character', 'typing', `typing-${characterId}`);

    const icon = document.createElement('span');
    icon.classList.add('typing-icon');
    icon.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
        icon.appendChild(document.createElement('span'));
    }

    const label = document.createElement('span');
    label.classList.add('typing-label');
    label.textContent = `${character.shortName}: ${character.typingLabel}`;

    typingElement.append(icon, label);
    return typingElement;
}

// Renderiza los mensajes del personaje en el contenedor recibido.
// Se usa textContent en lugar de innerHTML para que el texto nunca se interprete como HTML (prevención de XSS).
function renderMessages(messagesList, characterId) {
    if (!messagesList) return;

    messagesList.replaceChildren();

    getConversation(characterId).forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', msg.sender === 'user' ? 'user' : 'character');
        if (msg.isError) messageElement.classList.add('error');
        messageElement.textContent = msg.text;
        messagesList.appendChild(messageElement);
    });

    // Estado de carga: solo en la conversación del personaje que está respondiendo
    if (waitingFor === characterId) {
        messagesList.appendChild(createTypingIndicator(characterId));
    }

    messagesList.scrollTop = messagesList.scrollHeight;
}

// Activa o desactiva el formulario según el estado de espera
function updateFormState(chatInput, submitButton) {
    const disabled = waitingFor !== null;
    if (chatInput) chatInput.disabled = disabled;
    if (submitButton) submitButton.disabled = disabled;
}

// Muestra la cabecera del chat (foto, nombre y especialidad) y el selector de personaje
function renderCharacterHeader(characterId) {
    const character = CHARACTERS[characterId];

    const title = document.getElementById('chatTitle');
    if (title) title.textContent = `Sala de Conversación con ${character.shortName}`;

    const header = document.getElementById('chatCharacter');
    if (header) {
        const avatar = document.createElement('img');
        avatar.src = character.image;
        avatar.alt = '';
        avatar.classList.add('chat-avatar');

        const info = document.createElement('div');
        const name = document.createElement('p');
        name.classList.add('chat-character-name');
        name.textContent = character.name;
        const role = document.createElement('p');
        role.classList.add('chat-character-role');
        role.textContent = character.role;
        info.append(name, role);

        header.replaceChildren(avatar, info);
    }

    const switcher = document.getElementById('characterSwitcher');
    if (switcher) {
        const links = CHARACTER_ORDER.map((id) => {
            const link = document.createElement('a');
            link.href = `/chat?personaje=${id}`;
            link.dataset.link = '';
            link.classList.add('switch-option', `switch-${id}`);
            link.textContent = CHARACTERS[id].shortName;
            if (id === characterId) link.setAttribute('aria-current', 'true');
            return link;
        });
        switcher.replaceChildren(...links);
    }

    const container = document.querySelector('.chat-container');
    if (container) {
        CHARACTER_ORDER.forEach((id) => container.classList.remove(`chat-${id}`));
        container.classList.add(`chat-${characterId}`);
    }
}

// Envía el historial completo del personaje al servidor y devuelve el texto de la respuesta.
// Lanza un Error con un mensaje apto para mostrar al usuario si algo falla.
async function requestReply(history, characterId) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT);

    let response;
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history, character: characterId }),
            signal: controller.signal
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`${CHARACTERS[characterId].shortName} tardó demasiado en responder. Inténtalo de nuevo.`);
        }
        throw new Error('Falla geológica en la red. No puedo comunicarme con el servidor en este momento.');
    } finally {
        clearTimeout(timeoutId);
    }

    // La respuesta podría no ser JSON (por ejemplo, una página de error del servidor)
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error || getErrorMessageForStatus(response.status));
    }
    if (!data || typeof data.reply !== 'string' || data.reply.trim().length === 0) {
        throw new Error('Recibí una respuesta inesperada del servidor.');
    }
    return data.reply;
}

// Inicializa la lógica del chat cada vez que se monta la vista /chat.
// characterId: personaje elegido en la URL; si no hay, se mantiene el último usado.
export function initChatLogic(characterId) {
    if (characterId && CHARACTERS[characterId]) {
        activeCharacter = characterId;
    }

    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesList = document.getElementById('messagesList');

    if (!chatForm || !chatInput || !messagesList) return;

    const submitButton = chatForm.querySelector('button[type="submit"]');
    chatInput.maxLength = MAX_MESSAGE_LENGTH;
    chatInput.placeholder = CHARACTERS[activeCharacter].placeholder;

    // Renderizado inicial al entrar a la vista de chat (respeta una petición en curso)
    renderCharacterHeader(activeCharacter);
    renderMessages(messagesList, activeCharacter);
    updateFormState(chatInput, submitButton);

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (waitingFor !== null) return;

        const userText = chatInput.value;
        if (!isValidMessage(userText)) return;

        // El personaje se fija al enviar: la respuesta va a su conversación aunque el usuario cambie de personaje
        const characterId = activeCharacter;
        const conversation = getConversation(characterId);

        // 1. Añadir el mensaje del usuario a la memoria y mostrar el estado de carga
        const userMessage = createMessage('user', userText);
        conversation.push(userMessage);
        chatInput.value = '';
        waitingFor = characterId;
        renderMessages(messagesList, characterId);
        updateFormState(chatInput, submitButton);

        // 2. Pedir la respuesta al servidor enviando el historial completo del personaje
        try {
            const reply = await requestReply(toApiHistory(conversation), characterId);
            conversation.push(createMessage('character', reply));
        } catch (error) {
            // El mensaje sigue visible, pero no se reenviará a la IA en el historial
            userMessage.failed = true;
            conversation.push(createMessage('character', error.message, true));
        } finally {
            waitingFor = null;
        }

        // 3. Volver a renderizar con los elementos actuales del DOM y el personaje que esté activo ahora
        const currentInput = document.getElementById('chatInput');
        const currentForm = document.getElementById('chatForm');
        renderMessages(document.getElementById('messagesList'), activeCharacter);
        updateFormState(currentInput, currentForm?.querySelector('button[type="submit"]'));
        currentInput?.focus();
    });
}
