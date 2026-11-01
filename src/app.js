// 1. Importamos la lógica del chat, los datos de los personajes y las utilidades
import { initChatLogic } from './chat.js';
import { CHARACTER_ORDER } from './characters.js';
import { getCharacterFromSearch, resolveTheme } from './utils.js';

// 2. Definimos el contenido de nuestras vistas
const routes = {
    // La vista Home debe mantenerse sincronizada con el contenido inicial de index.html
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

          <section class="characters" aria-labelledby="characters-title">
            <h3 id="characters-title" class="section-title">Elige a tu científico</h3>
            <div class="character-grid">
              <article class="character-card card-sheldon">
                <div class="card-image">
                  <img src="/img/personajes/sheldon.jpg" alt="Sheldon Cooper con su camiseta de Flash" loading="lazy" />
                </div>
                <div class="card-body">
                  <h4 class="card-name">Sheldon Cooper</h4>
                  <p class="card-role">Físico teórico</p>
                  <p class="card-description">Brillante, extremadamente lógico y amante de las reglas.</p>
                  <a href="/chat?personaje=sheldon" class="card-button" data-link>Chatear con Sheldon</a>
                </div>
              </article>
              <article class="character-card card-amy">
                <div class="card-image">
                  <img src="/img/personajes/amy.jpg" alt="Amy Farrah Fowler sonriendo" loading="lazy" />
                </div>
                <div class="card-body">
                  <h4 class="card-name">Amy Farrah Fowler</h4>
                  <p class="card-role">Neurobióloga</p>
                  <p class="card-description">Inteligente, analítica y apasionada por la ciencia.</p>
                  <a href="/chat?personaje=amy" class="card-button" data-link>Chatear con Amy</a>
                </div>
              </article>
              <article class="character-card card-leonard">
                <div class="card-image">
                  <img src="/img/personajes/leonard.jpg" alt="Leonard Hofstadter con gafas" loading="lazy" />
                </div>
                <div class="card-body">
                  <h4 class="card-name">Leonard Hofstadter</h4>
                  <p class="card-role">Físico experimental</p>
                  <p class="card-description">Inteligente, curioso y orientado a la experimentación.</p>
                  <a href="/chat?personaje=leonard" class="card-button" data-link>Chatear con Leonard</a>
                </div>
              </article>
            </div>
          </section>
        </div>
    `,
    '/chat': `
        <div class="view-container">
            <h2 id="chatTitle">Sala de Conversación</h2>
            <div class="chat-toolbar">
                <div id="chatCharacter" class="chat-character"></div>
                <nav id="characterSwitcher" class="character-switcher" aria-label="Elegir científico"></nav>
            </div>
            <div class="chat-container">
                <div id="messagesList" class="messages-list" role="log" aria-live="polite">
                    <!-- Los mensajes del chat se renderizarán aquí dinámicamente -->
                </div>
                <form id="chatForm" class="chat-input-form">
                    <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." autocomplete="off" required>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    `,
    '/about': `
        <div class="view-container">
            <h2>Acerca del Proyecto (POC)</h2>
            <p>Esta aplicación web es una Prueba de Concepto desarrollada para ComicSansCon. Permite conversar con Sheldon Cooper, Amy Farrah Fowler y Leonard Hofstadter mediante inteligencia artificial de forma segura utilizando Serverless Functions.</p>
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

        // Si cargamos la vista de chat, inicializamos su lógica con el personaje indicado en la URL (?personaje=)
        if (path === '/chat') {
            initChatLogic(getCharacterFromSearch(window.location.search, CHARACTER_ORDER));
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
    document.querySelectorAll('header nav a').forEach((link) => {
        if (link.getAttribute('href') === path) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// 4. Función para interceptar los clics en los enlaces y usar pushState (SPA).
// Se interceptan los enlaces del menú y los enlaces internos marcados con data-link (tarjetas y selector de personaje).
function setupRouter() {
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('header nav a, a[data-link]');
        if (!link) return;

        const href = link.getAttribute('href');

        if (href && href.startsWith('/')) {
            e.preventDefault();

            // Evitamos duplicar entradas en el historial si ya estamos en esa ruta
            if (href === window.location.pathname + window.location.search) return;

            history.pushState({}, '', href);
            renderRoute();
        }
    });

    window.addEventListener('popstate', () => {
        renderRoute();
    });
}

// 5. Selector de tema claro/oscuro. La preferencia se guarda en localStorage.
const THEME_KEY = 'tbbu-theme';

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        const label = theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro';
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#090D1C' : '#EAF0FF';
}

function setupThemeToggle() {
    // El script de index.html ya aplicó el tema antes de pintar; aquí solo lo confirmamos
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch {
        // localStorage puede no estar disponible (modo privado): se usa la preferencia del sistema
    }
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
    applyTheme(document.documentElement.dataset.theme || resolveTheme(saved, prefersLight));

    document.getElementById('themeToggle')?.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch {
            // Si no se puede guardar, el tema cambia igualmente durante esta visita
        }
    });
}

// 6. Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupRouter();
    renderRoute();
});
