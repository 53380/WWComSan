import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const repoBase = process.env.VITE_PAGES_BASE || '/WWComSan/demo/';

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : repoBase,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../../docs/demo',
    emptyOutDir: true
  }
}));
