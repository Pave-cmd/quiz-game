import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: {
      clientPort: process.env.CODESPACES ? 443 : undefined
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Přidat base URL pro správné načítání assetů
  base: './'
});