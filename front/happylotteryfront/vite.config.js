import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // Proveedor de cobertura
      reporter: ['text', 'html'], // Reportes que deseas generar
      reportsDirectory: './coverage', // Carpeta donde se guardan los reportes
    },
  },
});

