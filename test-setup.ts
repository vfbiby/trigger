import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 极简版chrome mock实现
let storageData: Record<string, any> = {}

const chromeMock = {
  storage: {
    local: {
      get: vi.fn().mockImplementation((key, callback) => {
        callback(storageData)
      }),
      set: vi.fn().mockImplementation((data, callback) => {
        storageData = { ...storageData, ...data }
        if (callback) callback()
      })
    }
  }
}

// 清理DOM
afterEach(() => {
  cleanup()
})

// 初始化chrome mock
beforeEach(() => {
  // @ts-ignore
  global.chrome = chromeMock
})