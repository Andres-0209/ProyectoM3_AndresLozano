import { describe, it, expect } from 'vitest';
import {
    MAX_MESSAGE_LENGTH,
    MAX_HISTORY_MESSAGES,
    MAX_MODEL_HISTORY_LENGTH,
    normalizeText,
    isValidMessage,
    createMessage,
    toApiHistory,
    getErrorMessageForStatus,
    getCharacterFromSearch,
    resolveTheme
}  from '../src/utils.js';
import { CHARACTERS, CHARACTER_ORDER } from '../src/characters.js';
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

    it('recorta las respuestas largas del personaje y no recorta los mensajes del usuario', () => {
        const longReply = 'a'.repeat(MAX_MODEL_HISTORY_LENGTH + 300);
        const memory = [
            createMessage('user', 'Explícame la teoría de cuerdas'),
            createMessage('character', longReply),
            createMessage('user', '¿Por qué?')
        ];
        const history = toApiHistory(memory);

        expect(history[1].text.length).toBe(MAX_MODEL_HISTORY_LENGTH);
        expect(history[0].text).toBe('Explícame la teoría de cuerdas');
        expect(history[2].text).toBe('¿Por qué?');
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
describe('getCharacterFromSearch', () => {
    it('devuelve el personaje indicado en la URL', () => {
        expect(getCharacterFromSearch('?personaje=amy', CHARACTER_ORDER)).toBe('amy');
        expect(getCharacterFromSearch('?personaje=Leonard', CHARACTER_ORDER)).toBe('leonard');
    });

    it('devuelve null si no hay personaje o si no es válido', () => {
        expect(getCharacterFromSearch('', CHARACTER_ORDER)).toBeNull();
        expect(getCharacterFromSearch('?personaje=penny', CHARACTER_ORDER)).toBeNull();
        expect(getCharacterFromSearch('?otro=amy', CHARACTER_ORDER)).toBeNull();
        expect(getCharacterFromSearch(undefined, CHARACTER_ORDER)).toBeNull();
    });
});

describe('resolveTheme', () => {
    it('respeta la preferencia guardada', () => {
        expect(resolveTheme('light', false)).toBe('light');
        expect(resolveTheme('dark', true)).toBe('dark');
    });

    it('usa la preferencia del sistema si no hay nada guardado o el valor no es válido', () => {
        expect(resolveTheme(null, true)).toBe('light');
        expect(resolveTheme(null, false)).toBe('dark');
        expect(resolveTheme('azul', true)).toBe('light');
    });
});

describe('datos de los personajes', () => {
    it('cada personaje tiene todos los datos que necesita la interfaz', () => {
        const fields = ['id', 'name', 'shortName', 'role', 'description', 'image', 'imageAlt', 'greeting', 'typingLabel', 'placeholder'];
        CHARACTER_ORDER.forEach((id) => {
            expect(CHARACTERS[id].id).toBe(id);
            fields.forEach((field) => expect(CHARACTERS[id][field]).toBeTruthy());
        });
    });
});