import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // 💡 빨간 줄이 뜨던 고정형 path.resolve 대신, 브라우저 표준 URL 시스템을 사용해 에러 원천 차단!
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  // SVG 및 CSV 로우 파일 임포트 지원 스펙 보존
  assetsInclude: ['**/*.svg', '**/*.csv'],
})