// Funciones puras de utilidad (sin acceso al DOM ni estado global)

// Longitud máxima permitida para un mensaje del chat (coincide con el límite del servidor)
export const MAX_MESSAGE_LENGTH = 500;

// Número máximo de mensajes del historial que se envían al servidor (coincide con el límite del servidor)
export const MAX_HISTORY_MESSAGES = 20;

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

// Crea un objeto mensaje con la estructura que usa la memoria del chat.
// isError marca los avisos de error, que se muestran pero no se envían a la IA.
export function createMessage(sender, text, isError = false) {
    return { sender, text: normalizeText(text), isError };
}

// Convierte la memoria del chat al historial que espera el servidor: [{ role: 'user' | 'model', text }]
// - Excluye los mensajes de error y los mensajes del usuario que no obtuvieron respuesta (failed),
//   para que los turnos usuario/personaje sigan alternándose.
// - Conserva solo los últimos MAX_HISTORY_MESSAGES.
// - Elimina los mensajes iniciales del personaje para que el historial empiece por el usuario.
export function toApiHistory(chatMemory) {
    if (!Array.isArray(chatMemory)) return [];

    const history = chatMemory
        .filter((msg) => !msg.isError && !msg.failed && typeof msg.text === 'string' && msg.text.length > 0)
        .map((msg) => ({ role: msg.sender === 'user' ? 'user' : 'model', text: msg.text }))
        .slice(-MAX_HISTORY_MESSAGES);

    const firstUserIndex = history.findIndex((msg) => msg.role === 'user');
    return firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
}

// Mensaje para el usuario según el código HTTP, cuando el servidor no envía uno propio
export function getErrorMessageForStatus(status) {
    if (status === 429) return 'Demasiadas consultas. Espera un momento antes de volver a intentarlo.';
    if (status === 400) return 'No pude entender tu mensaje. Revisa lo que escribiste.';
    if (status === 404) return 'No encuentro el servidor de Sheldon. Comprueba que la aplicación se está ejecutando con vercel dev.';
    if (status >= 500) return 'Error en el sistema. Mis capacidades lógicas superan esta anomalía temporal.';
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
