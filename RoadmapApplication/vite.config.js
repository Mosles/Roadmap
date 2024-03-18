import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set your preferred port
    open: true, // Automatically open the browser
    proxy: {
      // Proxying requests from "/api" to your backend server on port 5000
      '/api': 'http://localhost:5000',
      '/csrf-token': 'http://localhost:5000'
    }
  },
});
