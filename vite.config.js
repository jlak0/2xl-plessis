import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://alpacai.net',
        changeOrigin: true,
      }
    }
  }
});
