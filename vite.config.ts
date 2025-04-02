import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Base URL for production
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3305,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
        },
      },
    },
  },
}); 