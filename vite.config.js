import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true },
  preview: { host: true },
  build: { target: 'es2020', chunkSizeWarningLimit: 1200 },
});
