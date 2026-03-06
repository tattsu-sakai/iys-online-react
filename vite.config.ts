import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'IysReact',
      fileName: 'iys-react',
      formats: ['iife'],
    },
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-is': fileURLToPath(new URL('./src/shims/react-is.ts', import.meta.url)),
    },
  },
});
