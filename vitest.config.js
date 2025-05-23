// filepath: /home/baba/Development/sanity-suite/vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    exclude: ['**/node_modules/**', '**/coverage/**'],
    root: '.',
    coverage: {
      include: ['**/*.{js,jsx}'],
      exclude: ['**/node_modules/**', '**/coverage/**', '**/vitest.config.js', '**/jest.config.js']
    }
  }
});