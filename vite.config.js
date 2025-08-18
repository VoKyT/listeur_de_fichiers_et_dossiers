import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuration pour Electron
  base: process.env.ELECTRON == "true" ? './' : '/',
  
  // Configuration des alias pour imports simplifiés
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
    }
  },
  
  // Configuration du build pour Electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // Configuration du serveur de développement
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  
  // Configuration CSS avec PostCSS/Tailwind
  css: {
    postcss: './postcss.config.js',
  },
  
  // Optimisation pour Electron
  optimizeDeps: {
    exclude: ['electron']
  }
})
