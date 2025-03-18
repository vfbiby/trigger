import { renderHook, act } from '@testing-library/react'
import { usePromotionsStorage } from '../../src/hooks/usePromotionsStorage.ts'
import { describe, it, expect } from 'vitest'

describe('usePromotionsStorage Hook', () => {
  it('should return initial empty state', () => {
    const { result } = renderHook(() => usePromotionsStorage())
    expect(result.current.promotions).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('should handle storage updates', async () => {
    const { result } = renderHook(() => usePromotionsStorage())
    
    await act(async () => {
      // Mock chrome storage
      await chrome.storage.local.set({
        promotions: {
          data: {
            promotions: [{
              promotion_id: '1',
              title: 'Test Promotion',
              cover: '',
              price_desc: {
                min_price: {
                  origin: 0
                }
              }
            }]
          },
          expires: Date.now() + 1000 * 60 * 60 // 1 hour
        }
      })
    })
    
    expect(result.current.promotions).toEqual([
      {
        promotion_id: '1',
        title: 'Test Promotion',
        cover: '',
        price_desc: {
          min_price: {
            origin: 0
          }
        }
      }
    ])
  })
})