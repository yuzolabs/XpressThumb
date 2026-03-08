import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git', 'tests/e2e/**'],
  },
})
