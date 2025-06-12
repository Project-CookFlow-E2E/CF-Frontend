import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    globals: true, // Permite usar 'describe', 'it', 'expect' globalmente
    environment: 'jsdom', // Simula un entorno de navegador (DOM) para tus tests
    setupFiles: './src/setupTests.js', // Ruta a tu archivo de configuración de tests
    
    // Configuración de cobertura de código
    // coverage: {
    //   provider: 'v8', // Puedes usar 'v8' o 'istanbul'
    //   reporter: ['text', 'json', 'html'], // Formatos de reporte de cobertura
    //   exclude: ['node_modules/', 'src/main.jsx', 'src/App.jsx'], // Excluye archivos y carpetas del reporte
    // },
  },
})
