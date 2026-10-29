// 1. Estado en memoria del chat
let chatMemory = [
    { sender: 'character', text: 'Hola. Espero que tus preguntas se encuentren dentro de los parámetros de la lógica y la razón.' }
];

// 2. Definimos el contenido de nuestras vistas
const routes = {
    '/home': `
        <div class="view-container">
            <h2>Bienvenido al mundo de la Fisica Teorica</h2>
            <p>Hola. Asumo que ya están familiarizados con mi intelecto... Soy Sheldon Lee Cooper, físico teórico con un coeficiente intelectual de 187.</p>
            <div class="image-gallery">
                <img src="img/sheldon1.jpg" alt="Sheldon Cooper analizando">
                <img src="img/sheldon2.jpg" alt="Sheldon Cooper en su sitio">
            </div>
        </div>
    `,
    '/chat': `
        <div class="view-container">
            <h2>Sala de Conversación con Sheldon</h2>
            <div class="chat-container">
                <div id="messagesList" class="messages-list">
                    <!-- Los mensajes del chat se renderizarán aquí dinámicamente -->
                </div>
                <form id="chatForm" class="chat-input-form">
                    <input type="text" id="chatInput" placeholder="Escribe tu mensaje para Sheldon..." autocomplete="off" required>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    `,
    '/about': `
        <div class="view-container">
            <h2>Acerca del Proyecto (POC)</h2>
            <p>Esta aplicación web es una Prueba de Concepto desarrollada para ComicSansCon. Permite interactuar con Sheldon Cooper mediante inteligencia artificial de forma segura utilizando Serverless Functions.</p>
            <p><strong>Desarrollado por:</strong> Andrés Lozano</p>
        </div>
    `
};

// 3. Función principal para renderizar la vista según la URL actual
function renderRoute() {
    let path = window.location.pathname;
    
    // Si la ruta está vacía o es la raíz, la normalizamos a /home
    if (path === '/' || path === '') {
        path = '/home';
    }

    const appContainer = document.getElementById('app');
    
    if (routes[path]) {
        appContainer.innerHTML = routes[path];
        
        // Si cargamos la vista de chat, inicializamos su lógica y renderizamos la memoria
        if (path === '/chat') {
            initChatLogic();
        }
    } else {
        appContainer.innerHTML = `
            <div class="view-container">
                <h2>404 - Error Geológico</h2>
                <p>La ruta que buscas no existe en este universo ni en ninguna de sus dimensiones paralelas.</p>
            </div>
        `;
    }
}

// 4. Función para interceptar los clics en los enlaces y usar pushState (SPA)
function setupRouter() {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('nav a') || e.target.closest('nav a')) {
            const link = e.target.closest('nav a');
            const href = link.getAttribute('href');

            if (href && href.startsWith('/')) {
                e.preventDefault();
                history.pushState({}, '', href);
                renderRoute();
            }
        }
    });

    window.addEventListener('popstate', () => {
        renderRoute();
    });
}

// 5. Lógica del Chat conectada al backend y gestión de memoria
function initChatLogic() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const messagesList = document.getElementById('messagesList');

    function renderMessages() {
        if (!messagesList) return;
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
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // 1. Añadir mensaje del usuario a la memoria
            chatMemory.push({ sender: 'user', text: userText });
            chatInput.value = '';
            renderMessages();

            try {
                // 2. Petición POST a la Serverless Function de la API
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText })
                });

                const data = await response.json();

                if (response.ok) {
                    chatMemory.push({ sender: 'character', text: data.reply });
                } else {
                    chatMemory.push({ sender: 'character', text: 'Error en el sistema. Mis capacidades lógicas superan esta anomalía temporal.' });
                }
            } catch (error) {
                console.error('Error de red:', error);
                chatMemory.push({ sender: 'character', text: 'Falla geológica en la red. No puedo comunicarme con el servidor en este momento.' });
            }

            renderMessages();
        });
    }
}

// 6. Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupRouter();
    renderRoute();
});