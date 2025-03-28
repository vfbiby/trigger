import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";






import "@testing-library/jest-dom";



import AutoPromotion from "../../src/components/AutoPromotion.tsx";
import type { Promotion } from "../../src/hooks/usePromotionsStorage.ts";


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
          get: vi.fn().mockImplementation((keys, callback) => {
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

  it("interval策略应在指定间隔后重新弹讲解", async () => {
    const intervalSeconds = 5; // 测试5秒间隔
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const promotions: Promotion[] = [{
      promotion_id: "123",
      title: "测试商品",
      cover: "test.jpg",
      price_desc: { min_price: { origin: 99 } }
    }];

    // Mock chrome.storage
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: vi.fn().mockImplementation((keys, callback) => {
            callback({ liveParams: {
              verifyFp: "test_verify_fp",
              fp: "test_fp",
              msToken: "test_ms_token",
              a_bogus: "test_a_bogus"
            }});
          })
        }
      }
    });

    // Mock fetch
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    global.fetch = fetchMock;

    // @ts-ignore
    const user = userEvent.setup({ delay: null });
    render(<AutoPromotion promotions={promotions} />);

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // 选择interval策略
    const strategyOptions = screen.getAllByRole("radio");
    await user.click(strategyOptions[2]); // interval是第三个选项

    // 设置间隔时间为5秒
    const intervalSlider = screen.getByRole("slider");
    await user.type(intervalSlider, intervalSeconds.toString());

    // 启动策略
    const startButton = screen.getByRole("button", { name: /开始弹讲解/ });
    await user.click(startButton);

    // 验证初始请求
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockClear();

    // 推进时间到间隔时间后
    await act(async () => {
      vi.advanceTimersByTime(intervalSeconds * 1000);
    });

    // 验证只发起了新的请求（没有取消请求）
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const requestUrl = fetchMock.mock.calls[0][0]
    const requestOptions = fetchMock.mock.calls[0][1]
    expect(requestOptions.body).toBeInstanceOf(FormData)
    // 验证请求URL包含正确的参数
    console.log(requestUrl)
    expect(requestUrl).not.toContain('cancel=false')

    // 恢复真实定时器
    vi.useRealTimers();
  });
})

describe("测试延迟函数示例", () => {
  it("应等待2秒后返回结果", async () => {
    // 定义被测试的延迟函数
    const delayedFunction = (callback: (result: string) => void) => {
      setTimeout(() => callback("success"), 2000)
    }

    // 使用fake timers
    vi.useFakeTimers()

    // 准备断言变量
    let result: string | undefined

    // 触发定时器
    delayedFunction((res) => {
      result = res
    })

    // 推进时间到2秒后
    vi.advanceTimersByTime(2000)

    // 验证结果
    expect(result).toBe("success")

    // 恢复真实定时器（可选）
    vi.useRealTimers()
  })

  it("应每秒执行三次间隔任务", async () => {
    let intervalCount = 0
    const intervalCallback = () => intervalCount++

    vi.useFakeTimers()

    // 创建每秒执行一次的定时器
    const intervalId = setInterval(intervalCallback, 1000)

    // 推进3秒时间
    vi.advanceTimersByTime(3000)

    // 验证执行了3次（初始不计数，1s/2s/3s各触发一次）
    expect(intervalCount).toBe(3)

    // 清除定时器并恢复真实定时器
    clearInterval(intervalId)
    vi.useRealTimers()
  })
})

describe("HelloWorld组件延迟显示测试", () => {
  it("应初始不显示Hello World，1秒后显示", async () => {
    // 创建被测试组件
    const HelloWorld = () => {
      const [show, setShow] = React.useState(false)
      React.useEffect(() => {
        const timer = setTimeout(() => {
          setShow(true)
        }, 1000)
        return () => clearTimeout(timer)
      }, [])
      return show ? (
        <div data-testid="hello">Hello World</div>
      ) : (
        <div data-testid="initial">初始文本</div>
      )
    }

    // 使用fake timers控制时间
    vi.useFakeTimers()

    // 渲染组件
    render(<HelloWorld />)

    // 新增：断言初始文本存在
    expect(screen.getByText("初始文本")).toBeInTheDocument()

    // 保留原有断言：Hello World初始不可见
    expect(screen.queryByTestId("hello")).not.toBeInTheDocument()

    // 推进时间到1秒后（使用act包裹并确保完全执行）
    await act(async () => {
      vi.advanceTimersByTime(1000);
      // 确保所有待处理的Promise都已解决
      await Promise.resolve();
    });

    // 直接断言，不使用waitFor
    expect(screen.getByTestId("hello")).toHaveTextContent("Hello World")
    expect(screen.queryByText("初始文本")).not.toBeInTheDocument()

    // 恢复真实定时器
    vi.useRealTimers()
  }) // 增加测试用例的全局超时时间到10秒
})
