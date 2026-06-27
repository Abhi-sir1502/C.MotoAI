import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ================================================================
// VITE CONFIGURATION
// ================================================================
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
    },
  },
  // Optional: Add base path for production
  // base: '/',
})