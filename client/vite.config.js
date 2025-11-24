import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🚀 THE FIX: Configure the proxy here
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://127.0.0.1:5000', // <-- Your Express Backend URL
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // Set to true if using HTTPS
      },
      '/uploads': { // <-- NEW: Proxy for static files
        target: 'http://localhost:5000', // Express server port
        changeOrigin: true,
      },
    },
  },
})