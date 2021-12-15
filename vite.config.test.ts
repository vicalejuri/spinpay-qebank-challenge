import { defineConfig } from 'vite';

import viteTestPlugin from 'vite-plugin-test';
// import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    reactRefresh(),
    viteTestPlugin({
      watch: true,
      dir: './src',
      loaders: {
        // '.test.ts': 'ts-loader',
        '.test.ts': 'tsx'
      }
    })
  ]
});
