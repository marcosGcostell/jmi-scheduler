import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, 'frontend'),
  server: {
    port: 8000,
    open: true,
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
});
