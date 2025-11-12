import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove non-error logs in production only
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production'
          ? ['console.log', 'console.debug', 'console.info', 'console.warn']
          : [],
      },
    },
  },
}))