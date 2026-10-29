import { isValidMessage, createMessage, getSimulatedReply, MAX_MESSAGE_LENGTH } from './utils.js';

// Estado del chat en memoria: se conserva al navegar entre vistas mientras no se recargue la página
const chatMemory = [
    createMessage('character', 'Hola. Espero que tus preguntas se encuentren dentro de los parámetros de la lógica y la razón.')
];

// Contador de respuestas simuladas para rotar entre ellas
let replyCount = 0;

// Tiempo de espera de la respuesta simulada (milisegundos)
const REPLY_DELAY = 1000;

// Renderiza los mensajes en el contenedor recibido.
// Se usa textContent en lugar de innerHTML para que el texto nunca se interprete como HTML (prevención de XSS).
function renderMessages(messagesList) {
    if (!messagesList) return;

    messagesList.replaceChildren();

    chatMemory.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', msg.sender === 'user' ? 'user' : 'character');
        messageElement.textContent = msg.text;
        messagesList.appendChild(messageElement);
    });

    messagesList.scrollTop = messagesList.scrollHeight;
}

// Inicializa la lógica del chat cada vez que se monta la vista /chat
export function initChatLogic() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesList = document.getElementById('messagesList');

    if (!chatForm || !chatInput || !messagesList) return;

    chatInput.maxLength = MAX_MESSAGE_LENGTH;

    // Renderizado inicial al entrar a la vista de chat
    renderMessages(messagesList);

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value;
        if (!isValidMessage(userText)) return;

        // 1. Añadir mensaje del usuario a la memoria
        chatMemory.push(createMessage('user', userText));
        chatInput.value = '';
        renderMessages(messagesList);

        // 2. Simular respuesta con la personalidad de Sheldon Cooper tras un pequeño retraso
        setTimeout(() => {
            chatMemory.push(createMessage('character', getSimulatedReply(replyCount)));
            replyCount++;
            // Si el usuario cambió de vista, la respuesta queda guardada y se mostrará al volver
            renderMessages(document.getElementById('messagesList'));
        }, REPLY_DELAY);
    });
}
