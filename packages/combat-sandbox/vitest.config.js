import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const setupFile = fileURLToPath(new URL('./src/__tests__/setup.js', import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [setupFile]
  }
});
