import { describe, it, expect } from 'vitest';
import {
    MAX_MESSAGE_LENGTH,
    MAX_HISTORY_MESSAGES,
    normalizeText,
    isValidMessage,
    createMessage,
    toApiHistory,
    getErrorMessageForStatus
}  from '../src/utils.js';
describe('normalizeText', () => {
    it('elimina espacios al inicio y al final y reduce los espacios internos repetidos', () => {
        expect(normalizeText('   Hola    Sheldon \n ')).toBe('Hola Sheldon');
    });

    it('devuelve una cadena vacía si no recibe un texto', () => {
        expect(normalizeText(null)).toBe('');
        expect(normalizeText(undefined)).toBe('');
        expect(normalizeText(42)).toBe('');
    });
});

describe('isValidMessage', () => {
    it('acepta un mensaje con contenido', () => {
        expect(isValidMessage('¿Qué es la entropía?')).toBe(true);
    });

    it('rechaza mensajes vacíos o formados solo por espacios', () => {
        expect(isValidMessage('')).toBe(false);
        expect(isValidMessage('    ')).toBe(false);
    });

    it('respeta la longitud máxima permitida', () => {
        expect(isValidMessage('a'.repeat(MAX_MESSAGE_LENGTH))).toBe(true);
        expect(isValidMessage('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBe(false);
    });
});

describe('createMessage', () => {
    it('crea un mensaje con el texto normalizado y sin marca de error', () => {
        expect(createMessage('user', '  Hola   mundo ')).toEqual({ sender: 'user', text: 'Hola mundo', isError: false });
    });

    it('permite marcar un mensaje como error', () => {
        expect(createMessage('character', 'Falla en la red', true).isError).toBe(true);
    });
});

describe('toApiHistory', () => {
    it('convierte la memoria del chat al formato del servidor (user / model)', () => {
        const memory = [
            createMessage('user', 'Hola'),
            createMessage('character', 'Saludos')
        ];

        expect(toApiHistory(memory)).toEqual([
            { role: 'user', text: 'Hola' },
            { role: 'model', text: 'Saludos' }
        ]);
    });

    it('elimina el saludo inicial del personaje para que el historial empiece por el usuario', () => {
        const memory = [
            createMessage('character', 'Hola. Espero que tus preguntas sean lógicas.'),
            createMessage('user', '¿Quién eres?')
        ];

        expect(toApiHistory(memory)).toEqual([{ role: 'user', text: '¿Quién eres?' }]);
    });

    it('excluye los avisos de error y los mensajes del usuario que fallaron', () => {
        const failedMessage = { ...createMessage('user', 'Pregunta fallida'), failed: true };
        const memory = [
            createMessage('user', 'Primera'),
            createMessage('character', 'Respuesta'),
            failedMessage,
            createMessage('character', 'Falla geológica en la red', true),
            createMessage('user', 'Segunda')
        ];

        expect(toApiHistory(memory).map((msg) => msg.role)).toEqual(['user', 'model', 'user']);
        expect(toApiHistory(memory).some((msg) => msg.text === 'Pregunta fallida')).toBe(false);
    });

    it('limita el historial a los últimos mensajes permitidos', () => {
        const memory = Array.from({ length: 30 }, (_, i) => createMessage(i % 2 === 0 ? 'user' : 'character', `Mensaje ${i}`));
        const history = toApiHistory(memory);

        expect(history.length).toBeLessThanOrEqual(MAX_HISTORY_MESSAGES);
        expect(history[0].role).toBe('user');
        expect(history.at(-1).text).toBe('Mensaje 29');
    });

    it('devuelve un array vacío si la entrada no es válida', () => {
        expect(toApiHistory(null)).toEqual([]);
        expect(toApiHistory([createMessage('character', 'Solo el saludo')])).toEqual([]);
    });

    it('no modifica la memoria original (función pura)', () => {
        const memory = [createMessage('user', 'Hola')];
        const copy = structuredClone(memory);

        toApiHistory(memory);
        expect(memory).toEqual(copy);
    });
});

describe('getErrorMessageForStatus', () => {
    it('devuelve un mensaje específico para cada tipo de error', () => {
        expect(getErrorMessageForStatus(429)).toMatch(/Demasiadas consultas/);
        expect(getErrorMessageForStatus(400)).toMatch(/No pude entender/);
        expect(getErrorMessageForStatus(404)).toMatch(/vercel dev/);
        expect(getErrorMessageForStatus(503)).toMatch(/Error en el sistema/);
    });

    it('devuelve un mensaje genérico para códigos no contemplados', () => {
        expect(getErrorMessageForStatus(418)).toMatch(/error inesperado/);
    });
});
