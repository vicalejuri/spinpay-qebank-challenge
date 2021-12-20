import { defineConfig } from 'vite';

import path from 'path';
import viteTestPlugin from 'vite-plugin-test';
import react from '@vitejs/plugin-react';

import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    react(),
    reactRefresh(),
    viteTestPlugin({
      watch: true,
      dir: './src',
      loaders: {
        '.test.tsx': 'tsx'
      }
    })
  ],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $features: path.resolve('./src/features'),
      $components: path.resolve('./src/components'),
      $tests: path.resolve('./tests')
    }
  }
});
