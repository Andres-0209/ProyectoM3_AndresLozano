import { defineConfig } from 'vitest/config';

// Configuración de Vitest: pruebas unitarias de funciones puras en Node (sin navegador)
export default defineConfig({
    test: {
        include: ['tests/**/*.test.js'],
        environment: 'node'
    }
});
