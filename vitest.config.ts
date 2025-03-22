import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/index.ts']
    },
    fakeTimers: {
      toFake: ['setTimeout', 'setInterval', 'Date'],
      advanceTimeDelta: 100
    }
  }
})