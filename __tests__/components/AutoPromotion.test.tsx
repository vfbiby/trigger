import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AutoPromotion from '../../src/components/AutoPromotion.tsx'
import type { Promotion } from '../../src/hooks/usePromotionsStorage.ts'

describe('AutoPromotion Component', () => {
  it('should render without crashing', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId('auto-promotion')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display error when no products are selected', () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId('no-products-error')).toHaveTextContent('没有选中的商品')
  })

  it('continuous策略应每5秒取消并重新弹讲解', async () => {
    // 不使用vi.useFakeTimers()，而是直接模拟setInterval
    const realSetInterval = global.setInterval
    const mockSetInterval = vi.fn((callback, delay) => {
      // 立即执行一次回调，然后返回一个假的timer ID
      setTimeout(callback, 0)
      return 123 // 假的timer ID
    })

    // @ts-ignore
    global.setInterval = mockSetInterval
    
    const promotions: Promotion[] = [{
      promotion_id: '123',
      title: '测试商品',
      cover: 'test.jpg',
      price_desc: { min_price: { origin: 99 } },
    }]
    const mockLiveParams = {
      verifyFp: 'test_verify_fp',
      fp: 'test_fp',
      msToken: 'test_ms_token',
      a_bogus: 'test_a_bogus'
    }

    // Mock chrome.storage
    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn().mockImplementation((keys, callback) => {
            callback({ liveParams: mockLiveParams })
          })
        }
      }
    })

    // Mock fetch
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
    global.fetch = fetchMock

    // 使用同步模式的userEvent
    // @ts-ignore
    const user = userEvent.setup({ delay: null })
    render(<AutoPromotion promotions={promotions} />)

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // 选择continuous策略
    const strategyOptions = screen.getAllByRole('radio')
    await user.click(strategyOptions[1])

    // 启动策略
    const startButton = screen.getByRole('button', { name: /开始弹讲解/ })
    await user.click(startButton)

    // 验证setInterval被调用
    expect(mockSetInterval).toHaveBeenCalled()
    
    // 等待所有异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 验证fetch被调用了至少3次（初始请求 + 取消请求 + 重新请求）
    expect(fetchMock).toHaveBeenCalledTimes(3)
    
    // 恢复原始setInterval
    global.setInterval = realSetInterval
  })
})