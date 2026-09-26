import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true },
  preview: { host: true, port: 4173, strictPort: true },
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
