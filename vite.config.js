import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' globalmente
    environment: 'jsdom', // Simula un entorno de navegador (DOM) para tus tests
    setupFiles: './src/setupTests.js', 
  },
})
