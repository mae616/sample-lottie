import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages用: リポジトリ名をベースパスに設定
  // mae616.github.io/sample-lottie/ でホスティングされるため
  // 参照: https://vite.dev/guide/static-deploy.html#github-pages
  base: '/sample-lottie/',
})
