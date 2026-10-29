// 1. Importamos la lógica del chat (estado en memoria y renderizado) desde su propio módulo
import { initChatLogic } from './chat.js';

// 2. Definimos el contenido de nuestras vistas
const routes = {
    '/home': `
        <div class="view-container">
            <h2>Bienvenido al mundo de la Fisica Teorica</h2>
            <p>Hola. Asumo que ya están familiarizados con mi intelecto... Soy Sheldon Lee Cooper, físico teórico con un coeficiente intelectual de 187.</p>
            <div class="image-gallery">
                <img src="/img/sheldon%201.jpeg" alt="Sheldon Cooper analizando">
                <img src="/img/sheldon%202.jpeg" alt="Sheldon Cooper en su sitio">
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
    
    // Si la ruta está vacía, es la raíz o es /index.html (p. ej. Live Server), la normalizamos a /home
    if (path === '/' || path === '' || path === '/index.html') {
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

                // Evitamos duplicar entradas en el historial si ya estamos en esa ruta
                if (href === window.location.pathname) return;

                history.pushState({}, '', href);
                renderRoute();
            }
        }
    });

    window.addEventListener('popstate', () => {
        renderRoute();
    });
}

// 5. Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupRouter();
    renderRoute();
});
