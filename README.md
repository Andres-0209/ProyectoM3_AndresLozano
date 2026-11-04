Documentación Técnica y Funcional: Proyecto M3 – "The Big Bang Universey"

Enlace de la aplicación desplegada:

https://proyecto-m3-andres-lozano.vercel.app

1. Presentación del Proyecto

Nombre del Proyecto: The Big Bang Universey (Proyecto M3).

Descripción: Aplicación web interactiva de tipo Single Page Application (SPA) ambientada en el universo de la serie The Big Bang Theory. La plataforma permite a los usuarios interactuar mediante un chat inteligente con múltiples personajes de la serie (Sheldon Cooper, Amy Farrah Fowler y Leonard Hofstadter), impulsados por modelos de la API de Google Gemini.

Propósito: Ofrecer una experiencia conversacional inmersiva y temática donde las respuestas imiten la personalidad, lógica y estilo característico de cada uno de los científicos de la serie.

Objetivos:

Implementar una arquitectura cliente en JavaScript Vanilla con enrutamiento personalizado (router dinámico) sin depender de frameworks pesados.

Integrar servicios serverless (Vercel Serverless Functions / Gemini API) y gestión de personajes múltiples para procesar consultas y generar respuestas contextuales en tiempo real.

Aplicar un diseño moderno enfocado en la temática de la física teórica y la cultura friki, alineado con las guías de auditoría y rediseño visual.

2. Descripción de los Personajes Disponibles

Dr. Sheldon Lee Cooper: Físico teórico, altamente analítico, strictly metódico, egocéntrico, observador de protocolos de convivencia y famoso por su muletilla «¡Bazinga!» («¡Zas, en toda la boca!»).

Dra. Amy Farrah Fowler: Neurobióloga, sumamente racional, fascinada por la dinámica social humana y con un peculiar apego emocional hacia Sheldon.

Dr. Leonard Hofstadter: Físico experimental, conciliador, práctico y la voz de la razón encargada de mediar con el comportamiento excéntrico de sus colegas.

3. Tecnologías Utilizadas

Frontend: HTML5 semántico, CSS3 (Variables CSS, Flexbox/Grid, estética neón) y JavaScript Vanilla (ES6 Modules).

Backend / Funciones Serverless: Node.js / Vercel Serverless Functions.

Servicio de Inteligencia Artificial: API de Google Gemini (Gemini API) administrada mediante llaves de entorno seguras.

Pruebas: Vitest (vitest.config.mjs).

Despliegue y Hosting: Vercel Platform.

4. Estructura Corregida de Carpetas, Archivos y Componentes

Basado en la estructura real del proyecto en el repositorio:

ProyectoM3_AndresLozano/
├── .vercel/
├── api/
│   └── functions.js         # Funciones serverless del backend (Conexión con Gemini API)
├── node_modules/
├── src/
│   ├── img/
│   │   └── personajes/
│   │       ├── amy.jpg
│   │       ├── leonard.jpg
│   │       ├── sheldon.jpg
│   │       ├── sheldon 1.jpeg
│   │       └── sheldon 2.jpeg
│   ├── app.js               # Punto de entrada principal y enrutador SPA
│   ├── characters.js        # Configuración y perfiles de los personajes
│   ├── chat.js              # Lógica de renderizado y envío de mensajes del chat
│   ├── index.html           # Estructura HTML principal
│   ├── styles.css           # Estilos globales y paleta de colores neón
│   └── utils.js             # Funciones de utilidad auxiliar
├── tests/
│   └── utils.test.js        # Suite de pruebas unitarias
├── .env                     # Variables de entorno locales
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── package-lock.json
├── package.json             # Dependencias del proyecto
├── README.md                # Guía rápida de uso
├── vercel.json              # Configuración de despliegue en Vercel
└── vitest.config.mjs        # Configuración del entorno de pruebas con Vitest


5. Funcionalidades Principales

Enrutamiento SPA en el Cliente: Navegación fluida sin recargas de página mediante el uso de JavaScript modular.

Selector de Personajes Múltiples: Permite alternar la conversación entre Sheldon Cooper, Amy Farrah Fowler y Leonard Hofstadter, cargando dinámicamente sus avatares y configuraciones de sistema.

Chat Interactivo con la IA: Envío y recepción de mensajes en tiempo real procesados por el backend serverless (api/functions.js).

Indicador de Estado de Escritura: Feedback visual mientras la IA procesa la respuesta del personaje.

Modo Oscuro / Neón ("Quantum Universe"): Interfaz diseñada con efectos luminosos y contrastes optimizados para lectura prolongada.

Diseño Adaptativo (Responsive Design): Ajuste de contenedores para pantallas de escritorio, tabletas y dispositivos móviles.

6. Requisitos y Pasos para Ejecutar Localmente

Requisitos Previos

Node.js (versión 18 o superior).

Vercel CLI instalado globalmente (npm install -g vercel).

Llave API válida de Google Gemini API (GEMINI_API_KEY).

Pasos de Instalación y Ejecución

Clonar e ingresar a la carpeta del proyecto:

git clone https://github.com/Andres-0209/ProyectoM3_AndresLozano.git
cd ProyectoM3_AndresLozano


Instalar dependencias:

npm install


Configurar el archivo .env:
Copia el archivo de ejemplo e introduce la clave del servicio sin subirla al control de versiones.

cp .env.example .env


Estructura del archivo .env:

GEMINI_API_KEY=tu_clave_api_aqui


Ejecutar en entorno local:
Utiliza Vercel Dev para simular tanto el servidor estático como las Serverless Functions de la ruta /api:

vercel dev


Accede desde el navegador a la dirección indicada por la consola (usualmente http://localhost:3000).

7. Cómo Ejecutar Tests

El proyecto utiliza Vitest como framework de pruebas unitarias y de integración.

Comando de ejecución:

npm test


Aspectos Verificados y Resultados

Pruebas de Utilidades y Componentes: Las pruebas ubicadas en tests/utils.test.js verifican la correcta ejecución de funciones auxiliares y validaciones del chat.

Resultado: Las pruebas ejecutadas en la suite pasan satisfactoriamente (PASS), confirmando la estabilidad de la lógica base.

8. Cómo Desplegar a Vercel

Preparación:
Asegúrate de tener todos los cambios guardados en el repositorio de GitHub y confirmar que el archivo .gitignore incluya .env y node_modules/.

Vinculación con Vercel:

Inicia sesión en el panel de Vercel.

Haz clic en Add New Project y selecciona el repositorio ProyectoM3_AndresLozano.

Configuración de Variables de Entorno:

En la sección Environment Variables, añade la variable:

Key: GEMINI_API_KEY

Value: (Tu API Key privada de Google Gemini)

Despliegue y Verificación:

Haz clic en Deploy.

Una vez finalizado el proceso de compilación, Vercel generará el enlace de producción.

Verifica la conectividad enviando un mensaje desde la pestaña de Chat.

9. Capturas de Pantalla de la Aplicación Funcionando

(Representación descriptiva de las capturas del proyecto)

Vista Principal (Home / Bienvenida):

Título: Interfaz de Bienvenida de The Big Bang Universey.

Descripción: Se observa el encabezado con iluminación neón, la introducción al mundo de la física teórica y las tarjetas de presentación de Sheldon, Amy y Leonard.

Pestaña de Chat Interactivo:

Título: Conversación en vivo con los personajes.

Descripción: Ventana principal del chat mostrando el intercambio de mensajes entre el usuario y la IA con el personaje seleccionado, destacando las burbujas diferenciadas y la respuesta temática.

Demostración del Modo Oscuro / Neón:

Título: Tema Oscuro Neón "Quantum Universe".

Descripción: Detalle visual de los componentes de entrada y botones con efectos luminosos en cyan y violeta sobre fondo oscuro.

10. Enlace a la Aplicación Desplegada

La aplicación se encuentra activa y disponible en el siguiente enlace:

👉 https://proyecto-m3-andres-lozano.vercel.app

11. Registro del Uso de IA

Conforme a los lineamientos expresados en la auditoría y guía de manejo de IA (MANEJO DE IA M3), se presentan los 3 prompts principales que guiaron la estructuración, rediseño y optimización del proyecto:

1. El Prompt de Asignación de Rol y Arquitectura Inicial

Fragmento clave:

"ACTÚA COMO UN INGENIERO DE SOFTWARE SENIOR, ARQUITECTO FRONTEND Y MENTOR TÉCNICO ESPECIALIZADO EN JAVASCRIPT, CSS RESPONSIVO, SPA, CONSUMO DE APIS, INTEGRACIÓN DE IA Y DESPLIEGUE..."

Por qué es relevante:

Este es el prompt fundacional del proyecto. Al definir un rol experto tan específico, el modelo adopta la postura adecuada para guiar todo el desarrollo del Proyecto Integrador (PI M3), estableciendo las reglas técnicas clave (Single Page Application, manejo asíncrono con fetch/async-await, seguridad con Vercel Serverless Functions y pruebas unitarias con Vitest).

2. El Prompt de Auditoría Visual y Rediseño Temático (The Big Bang Theory)

Fragmento clave:

"necesito que realices una auditoria del siguiente proyecto [GitHub] con el foco puntual de mejoras visuales... paleta de colores neón... inspirado en la serie de The Big Bang Theory... agregar dos personajes más (Amy Farrah Fowler y Leonard Hofstadter)... animación acorde al personaje (átomo, láser, neurona)"

Por qué es relevante:

Es el prompt más completo en cuanto a experiencia de usuario (UX/UI) y producto. Define por completo la identidad visual ("Quantum Universe"), la transformación de la página de inicio en tarjetas interactivas por personaje, el cambio de tema claro/oscuro y las animaciones de escritura personalizadas, manteniendo la cohesión con la temática de la serie sin romper la funcionalidad previa.

3. El Prompt de Validación y Estructuración Semántica del Código Base

Fragmento clave:

"esta seria la estructura base, que sugerencia das ...ProyectoM3_AndresLozano/
├── api/
│   └── functions.js
├── src/
│   ├── app.js
│   ├── chat.js
│   ├── index.html
│   ├── styles.css
│   └── utils.js
├── test/
│   ├── app.test.js
│   └── utils.test.js
├── .env
├── .env.example
├── .gitignore
└── README.md"

Por qué es relevante:

Representa el paso práctico de la teoría a la implementación. Al mostrar el código inicial de index.html, permitió al mentor detectar y corregir errores críticos de arquitectura antes de aplicar estilos (como la ruta absoluta del CSS, la ubicación incorrecta del <main id="app"> dentro del header/nav, y el ajuste de los enlaces para que la History API de la SPA funcionara correctamente sin recargar la página).

12. Conclusiones y Recomendaciones

Conclusiones:

La adopción de Vanilla JS combinado con funciones serverless en Vercel (api/functions.js) demostró ser una solución liviana y eficiente para implementar una SPA responsiva sin la sobrecarga de dependencias de un framework pesado.

La inclusión de múltiples personajes (Sheldon, Amy y Leonard) enriquece considerablemente la interacción conversacional.

La separación de responsabilidades (frontend estático vs. backend serverless para el API Key) garantiza la protección de credenciales sensibles.

Recomendaciones:

Persistencia: Implementar localStorage para guardar el historial de conversaciones localmente en el navegador según el personaje seleccionado.

Ampliación de Pruebas: Añadir más casos de prueba en tests/ para validar el selector de personajes y las llamadas mockeadas a las Serverless Functions.