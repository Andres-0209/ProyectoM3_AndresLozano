// Datos de los científicos disponibles (solo información; sin DOM ni estado)
// El identificador (id) debe coincidir con los personajes definidos en api/functions.js

export const CHARACTERS = {
    sheldon: {
        id: 'sheldon',
        name: 'Sheldon Cooper',
        shortName: 'Sheldon',
        role: 'Físico teórico',
        description: 'Brillante, extremadamente lógico y amante de las reglas.',
        image: '/img/personajes/sheldon.jpg',
        imageAlt: 'Sheldon Cooper con su camiseta de Flash',
        greeting: 'Hola. Espero que tus preguntas se encuentren dentro de los parámetros de la lógica y la razón.',
        typingLabel: 'Analizando una teoría...',
        placeholder: 'Escribe tu mensaje para Sheldon...'
    },
    amy: {
        id: 'amy',
        name: 'Amy Farrah Fowler',
        shortName: 'Amy',
        role: 'Neurobióloga',
        description: 'Inteligente, analítica y apasionada por la ciencia.',
        image: '/img/personajes/amy.jpg',
        imageAlt: 'Amy Farrah Fowler sonriendo',
        greeting: 'Hola. Soy Amy Farrah Fowler, neurobióloga. Mis neuronas están listas para analizar tus preguntas con rigor científico.',
        typingLabel: 'Procesando conexiones neuronales...',
        placeholder: 'Escribe tu mensaje para Amy...'
    },
    leonard: {
        id: 'leonard',
        name: 'Leonard Hofstadter',
        shortName: 'Leonard',
        role: 'Físico experimental',
        description: 'Inteligente, curioso y orientado a la experimentación.',
        image: '/img/personajes/leonard.jpg',
        imageAlt: 'Leonard Hofstadter con gafas',
        greeting: '¡Hola! Soy Leonard Hofstadter, físico experimental. ¿Qué experimento hacemos hoy?',
        typingLabel: 'Realizando un experimento...',
        placeholder: 'Escribe tu mensaje para Leonard...'
    }
};

// Orden en el que se muestran los personajes
export const CHARACTER_ORDER = ['sheldon', 'amy', 'leonard'];

export const DEFAULT_CHARACTER = 'sheldon';
