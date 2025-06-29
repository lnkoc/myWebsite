import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
        @import "@/assets/scss/base/_colors.scss";
        @import "@/assets/scss/base/_variables.scss";
        @import "@/assets/scss/base/_mixins.scss";
        @import "@/assets/scss/base/_typography.scss";
        @import "@/assets/scss/base/_reset.scss";
        @import "@/assets/scss/base/_utils.scss";
        @import "@/assets/scss/layout/_layout.scss";
        @import "@/assets/scss/components/_buttons.scss";
        `
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
