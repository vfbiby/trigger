import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 极简版chrome mock实现
let storageData: Record<string, any> = {}

const chromeMock = {
  storage: {
    local: {
      get: vi.fn().mockImplementation((keys, callback) => {
        const result = {}
        if (typeof keys === 'string') {
          result[keys] = storageData[keys]
        } else if (Array.isArray(keys)) {
          keys.forEach(key => {
            result[key] = storageData[key]
          })
        } else if (keys === null) {
          Object.assign(result, storageData)
        }
        callback(result)
      }),
      set: vi.fn().mockImplementation((data, callback) => {
        const changes: Record<string, chrome.storage.StorageChange> = {}
        Object.keys(data).forEach(key => {
          changes[key] = {
            oldValue: storageData[key],
            newValue: data[key]
          }
          storageData[key] = data[key]
        })
        
        // Trigger onChanged listeners
        chromeMock.storage.onChanged.addListener.mock.calls.forEach(([listener]) => {
          listener(changes, 'local')
        })
        
        if (callback) callback()
      })
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn()
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