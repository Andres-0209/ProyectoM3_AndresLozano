import { isValidMessage, createMessage, toApiHistory, getErrorMessageForStatus, MAX_MESSAGE_LENGTH } from './utils.js';

// Endpoint de la Serverless Function (archivo api/functions.js)
const API_URL = '/api/functions';

// Tiempo máximo de espera de la respuesta del servidor (milisegundos)
const CLIENT_TIMEOUT = 20000;

// Estado del chat en memoria: se conserva al navegar entre vistas mientras no se recargue la página
const chatMemory = [
    createMessage('character', 'Hola. Espero que tus preguntas se encuentren dentro de los parámetros de la lógica y la razón.')
];

// Indica si estamos esperando la respuesta de Sheldon (evita envíos duplicados)
let isWaiting = false;

// Renderiza los mensajes en el contenedor recibido.
// Se usa textContent en lugar de innerHTML para que el texto nunca se interprete como HTML (prevención de XSS).
function renderMessages(messagesList) {
    if (!messagesList) return;

    messagesList.replaceChildren();

    chatMemory.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', msg.sender === 'user' ? 'user' : 'character');
        if (msg.isError) messageElement.classList.add('error');
        messageElement.textContent = msg.text;
        messagesList.appendChild(messageElement);
    });

    // Estado de carga: indicador "escribiendo..."
    if (isWaiting) {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'character', 'typing');
        typingElement.textContent = 'Sheldon está escribiendo...';
        messagesList.appendChild(typingElement);
    }

    messagesList.scrollTop = messagesList.scrollHeight;
}

// Activa o desactiva el formulario según el estado de espera
function updateFormState(chatInput, submitButton) {
    if (chatInput) chatInput.disabled = isWaiting;
    if (submitButton) submitButton.disabled = isWaiting;
}

// Envía el historial completo al servidor y devuelve el texto de la respuesta.
// Lanza un Error con un mensaje apto para mostrar al usuario si algo falla.
async function requestReply(history) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT);

    let response;
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history }),
            signal: controller.signal
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Sheldon tardó demasiado en responder. Inténtalo de nuevo.');
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

// Inicializa la lógica del chat cada vez que se monta la vista /chat
export function initChatLogic() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesList = document.getElementById('messagesList');

    if (!chatForm || !chatInput || !messagesList) return;

    const submitButton = chatForm.querySelector('button[type="submit"]');
    chatInput.maxLength = MAX_MESSAGE_LENGTH;

    // Renderizado inicial al entrar a la vista de chat (respeta una petición en curso)
    renderMessages(messagesList);
    updateFormState(chatInput, submitButton);

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isWaiting) return;

        const userText = chatInput.value;
        if (!isValidMessage(userText)) return;

        // 1. Añadir el mensaje del usuario a la memoria y mostrar el estado de carga
        const userMessage = createMessage('user', userText);
        chatMemory.push(userMessage);
        chatInput.value = '';
        isWaiting = true;
        renderMessages(messagesList);
        updateFormState(chatInput, submitButton);

        // 2. Pedir la respuesta al servidor enviando el historial completo
        try {
            const reply = await requestReply(toApiHistory(chatMemory));
            chatMemory.push(createMessage('character', reply));
        } catch (error) {
            // El mensaje sigue visible, pero no se reenviará a la IA en el historial
            userMessage.failed = true;
            chatMemory.push(createMessage('character', error.message, true));
        } finally {
            isWaiting = false;
        }

        // 3. Volver a renderizar. Si el usuario cambió de vista, se usan los elementos actuales del DOM
        const currentInput = document.getElementById('chatInput');
        const currentForm = document.getElementById('chatForm');
        renderMessages(document.getElementById('messagesList'));
        updateFormState(currentInput, currentForm?.querySelector('button[type="submit"]'));
        currentInput?.focus();
    });
}
