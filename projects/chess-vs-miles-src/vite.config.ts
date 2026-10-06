import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs: the built folder is dropped into the portfolio at
  // /projects/chess-vs-miles/ and must work from there without a rebuild.
  base: './',
  plugins: [react()],
  build: {
    // The repo commits build output next to source; the sibling folder is
    // what GitHub Pages serves.
    outDir: '../chess-vs-miles',
    emptyOutDir: true,
  },
});
