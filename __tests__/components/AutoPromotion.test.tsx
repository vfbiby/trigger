import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { describe, expect, it, vi } from "vitest"

import "@testing-library/jest-dom"

import type { Promotion } from "~src/hooks/usePromotionsStorage.ts"

import AutoPromotion from "../../src/components/AutoPromotion.tsx"

describe("AutoPromotion Component", () => {
  it("should render without crashing", () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId("auto-promotion")).toBeInTheDocument()
  })

  it("should show loading state initially", () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("should display error when no products are selected", () => {
    render(<AutoPromotion promotions={[]} />)
    expect(screen.getByTestId("no-products-error")).toHaveTextContent(
      "没有选中的商品"
    )
  })

  it("continuous策略应每5秒取消并重新弹讲解", async () => {
    // 增加测试超时时间到5秒
    vi.useFakeTimers({ shouldAdvanceTime: true })

    const promotions: Promotion[] = [
      {
        promotion_id: "123",
        title: "测试商品",
        cover: "test.jpg",
        price_desc: { min_price: { origin: 99 } }
      }
    ]
    const mockLiveParams = {
      verifyFp: "test_verify_fp",
      fp: "test_fp",
      msToken: "test_ms_token",
      a_bogus: "test_a_bogus"
    }

    // Mock chrome.storage
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: vi.fn().mockImplementation((_keys, callback) => {
            callback({ liveParams: mockLiveParams })
          })
        }
      }
    })

    // Mock fetch - 使用更详细的mock实现
    const fetchMock = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    })
    global.fetch = fetchMock

    // 使用同步模式的userEvent
    // @ts-ignore
    const user = userEvent.setup({ delay: null })

    // 渲染组件
    render(<AutoPromotion promotions={promotions} />)
    // screen.debug()

    // 等待加载完成
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()

    // 选择continuous策略
    const strategyOptions = screen.getAllByRole("radio")
    await user.click(strategyOptions[1])

    // // 启动策略
    const startButton = screen.getByRole("button", { name: /开始弹讲解/ })

    await user.click(startButton)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    // 重置mock计数器以便于后续验证
    fetchMock.mockClear()

    // 使用act包裹定时器操作，确保React状态更新
    await act(async () => {
      // 推进时间到第一次间隔触发（5秒）
      vi.advanceTimersByTime(5000)
    })

    // 验证fetch被调用了2次（取消请求 + 重新请求）
    expect(fetchMock).toHaveBeenCalledTimes(2)

    // 恢复真实定时器
    vi.useRealTimers()
  }) // 增加测试超时时间到1.5秒

  it("interval策略应在12秒后开始计算间隔", async () => {
    const intervalSeconds = 5 // 测试5秒间隔
    vi.useFakeTimers({ shouldAdvanceTime: true })

    const promotions: Promotion[] = [
      {
        promotion_id: "123",
        title: "测试商品",
        cover: "test.jpg",
        price_desc: { min_price: { origin: 99 } }
      }
    ]

    // Mock chrome.storage
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: vi.fn().mockImplementation((_keys, callback) => {
            callback({
              liveParams: {
                verifyFp: "test_verify_fp",
                fp: "test_fp",
                msToken: "test_ms_token",
                a_bogus: "test_a_bogus"
              }
            })
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

    // @ts-ignore
    const user = userEvent.setup({ delay: null })
    render(<AutoPromotion promotions={promotions} />)

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // 选择interval策略
    const strategyOptions = screen.getAllByRole("radio")
    await user.click(strategyOptions[2]) // interval是第三个选项

    // 设置间隔时间为5秒
    const intervalSlider = screen.getByRole("slider")
    await user.type(intervalSlider, intervalSeconds.toString())

    expect(intervalSlider["value"]).toBe(intervalSeconds.toString())

    // 启动策略
    const startButton = screen.getByRole("button", { name: /开始弹讲解/ })
    await user.click(startButton)

    // 验证初始请求
    expect(fetchMock).toHaveBeenCalledTimes(1)
    fetchMock.mockClear()

    // 推进时间到12秒
    await act(async () => {
      vi.advanceTimersByTime(12000)
    })

    // 验证12秒内没有新请求
    expect(fetchMock).toHaveBeenCalledTimes(0)

    // 推进到17秒(12+5)
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    // 验证第二次请求
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // 恢复真实定时器
    vi.useRealTimers()
  })
})
