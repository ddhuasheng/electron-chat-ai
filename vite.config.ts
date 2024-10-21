import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
 
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer')
    }
  },
  plugins: [vue()],
  server: {
    port: 8899,
    host: '0.0.0.0',
    cors: true,
  },
  css: {
    
  }
})
