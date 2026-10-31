// 1. Importamos la lógica del chat (estado en memoria y renderizado) desde su propio módulo
import { initChatLogic } from './chat.js';

// 2. Definimos el contenido de nuestras vistas
const routes = {
    '/home': `
        <div class="view-container home-view">
          <section class="hero" aria-labelledby="hero-title">
            <div class="hero-text">
              <p class="hero-eyebrow">Bienvenido a</p>
              <h2 id="hero-title" class="hero-title">The Big Bang Universe</h2>
              <p class="hero-slogan">Donde la ciencia se encuentra con la conversación</p>
            </div>
            <div class="atom" aria-hidden="true">
              <span class="atom-nucleus"></span>
              <span class="atom-orbit"></span>
              <span class="atom-orbit"></span>
              <span class="atom-orbit"></span>
            </div>
          </section>

          <section class="intro" aria-labelledby="intro-title">
            <h3 id="intro-title" class="section-title">Bienvenido al mundo de la Física Teórica</h3>
            <div class="intro-grid">
              <article class="info-card">
                <h4>Quién soy</h4>
                <p>
                  Hola. Asumo que ya están familiarizados con mi intelecto, pero por si
                  acaso, permítanme presentarme: soy Sheldon Lee Cooper, físico teórico.
                  Poseo un doctorado, un máster, un coeficiente intelectual de 187 —el
                  cual, por razones obvias, no requiere validación por parte de ustedes—
                  y una capacidad superior para comprender las leyes fundamentales del
                  universo que escapa a la comprensión del ciudadano promedio.
                </p>
              </article>
              <article class="info-card">
                <h4>Mi día a día</h4>
                <p>
                  Trabajo en el departamento de física teórica del Caltech, donde paso
                  mis días resolviendo problemas complejos de la física, como la teoría
                  de cuerdas, y lidiando pacientemente con las limitaciones cognitivas
                  de mis colegas. Entre mis aficiones se encuentran los cómics, la
                  ciencia ficción, los trenes, las banderas del mundo y mantener un
                  estricto orden cronológico y higiénico en mi apartamento, el cual
                  comparto bajo los términos rigurosamente redactados de mi Acuerdo de
                  Compañero de Piso.
                </p>
              </article>
              <article class="info-card">
                <h4>Normas de convivencia</h4>
                <p>
                  Si en algún momento deciden interactuar conmigo, les sugiero que
                  eviten los chistes de doble sentido, no toquen mi sitio en el sofá y,
                  sobre todo, recuerden que si creen que han tenido una idea
                  brillante... geológicamente hablando, es muy probable que yo ya la
                  haya descartado hace años.
                </p>
              </article>
            </div>
            <blockquote class="bazinga-quote">
              <p>
                Ah, y por si acaso... ¡Bazinga! (Era una broma, mi intelecto no tolera
                las mentiras, pero a veces el humor humano requiere ciertas
                concesiones ilógicas).
              </p>
            </blockquote>
          </section>

          <section class="gallery-section" aria-label="Galería de Sheldon Cooper">
            <div class="image-gallery">
              <figure>
                <img src="/img/sheldon%201.jpeg" alt="Sheldon Cooper analizando" />
                <figcaption>Analizando una teoría</figcaption>
              </figure>
              <figure>
                <img src="/img/sheldon%202.jpeg" alt="Sheldon Cooper en su sitio" />
                <figcaption>En su sitio del sofá</figcaption>
              </figure>
            </div>
          </section>
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

    updateActiveLink(path);
}

// Marca en el menú el enlace de la vista actual (solo afecta a la presentación)
function updateActiveLink(path) {
    document.querySelectorAll('nav a').forEach((link) => {
        if (link.getAttribute('href') === path) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
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