import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/snake-game/',  // 將 <repository-name> 替換為你的 GitHub repo 名稱
})
