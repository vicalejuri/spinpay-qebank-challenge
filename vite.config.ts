import { defineConfig } from 'vite';

import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $features: path.resolve('./src/features'),
      $components: path.resolve('./src/components'),
      $tests: path.resolve('./tests')
    }
  }
});
