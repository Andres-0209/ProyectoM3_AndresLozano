// Funciones puras de utilidad (sin acceso al DOM ni estado global)

// Longitud máxima permitida para un mensaje del chat
export const MAX_MESSAGE_LENGTH = 500;

// Respuestas simuladas de Sheldon para la fase de chat en memoria
export const SIMULATED_REPLIES = [
    'Eso que mencionas es fascinante, aunque desde una perspectiva puramente física, carece de fundamento práctico. ¡Bazinga!',
    'Interesante hipótesis. Errónea, pero interesante.',
    'Mi coeficiente intelectual de 187 me obliga a señalar que tu premisa es incorrecta.',
    'Permíteme corregirte: lo que acabas de decir viola al menos dos leyes de la termodinámica.',
    'Estás en mi sitio. Ah, no, esto es un chat. Continúa.'
];

// Elimina espacios al inicio y al final, y reduce los espacios internos repetidos a uno solo
export function normalizeText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().replace(/\s+/g, ' ');
}

// Un mensaje es válido si, una vez normalizado, no está vacío y no supera la longitud máxima
export function isValidMessage(text) {
    const normalized = normalizeText(text);
    return normalized.length > 0 && normalized.length <= MAX_MESSAGE_LENGTH;
}

// Crea un objeto mensaje con la estructura que usa la memoria del chat
export function createMessage(sender, text) {
    return { sender, text: normalizeText(text) };
}

// Devuelve una respuesta simulada de forma rotativa según el índice recibido
export function getSimulatedReply(index) {
    const safeIndex = Number.isInteger(index) && index >= 0 ? index : 0;
    return SIMULATED_REPLIES[safeIndex % SIMULATED_REPLIES.length];
}
