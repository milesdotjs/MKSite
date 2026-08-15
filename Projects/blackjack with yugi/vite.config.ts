import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs so the built `dist/` folder works wherever you drop
  // it on a static site (e.g. /games/blackjack/) without rebuilding.
  base: './',
  plugins: [react()],
});
