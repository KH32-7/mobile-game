import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true },
  preview: { host: true, port: 4173 },
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
