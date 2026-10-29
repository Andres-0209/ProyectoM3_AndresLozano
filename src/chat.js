// Estructura sugerida para el chat en memoria
let chatMemory = [
    { sender: 'character', text: 'Hola. Espero que tus preguntas se encuentren dentro de los parámetros de la lógica y la razón.' }
];

function initChatLogic() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesList = document.getElementById('messagesList');

    // Función para renderizar los mensajes en el DOM basados en el array de memoria
    function renderMessages() {
        messagesList.innerHTML = chatMemory.map(msg => `
            <div class="message ${msg.sender}">
                ${msg.text}
            </div>
        `).join('');
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // Renderizado inicial al entrar a la vista de chat
    renderMessages();

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // 1. Añadir mensaje del usuario a la memoria
            chatMemory.push({ sender: 'user', text: userText });
            chatInput.value = '';
            renderMessages();

            // 2. Simular respuesta con la personalidad de Sheldon Cooper tras un pequeño retraso
            setTimeout(() => {
                chatMemory.push({ 
                    sender: 'character', 
                    text: 'Eso que mencionas es fascinante, aunque desde una perspectiva puramente física, carece de fundamento práctico. ¡Bazinga!' 
                });
                renderMessages();
            }, 1000);
        });
    }
}