import React, { useEffect, useState } from "react"

const PROMOTION_DURATION_MS = 12 * 1000 // 商品讲解固定展示12秒

import type { Promotion } from "../hooks/usePromotionsStorage.ts"

interface AutoPromotionProps {
  promotions: Promotion[]
}

type PromotionStrategy = "continuous" | "interval" | "alternating"

interface StrategyOption {
  value: PromotionStrategy
  label: string
  description: string
}

const AutoPromotion: React.FC<AutoPromotionProps> = ({ promotions }) => {
  const [strategy, setStrategy] = useState<PromotionStrategy>("continuous")
  const [intervalSeconds, setIntervalSeconds] = useState<number>(5)
  const [showSeconds, setShowSeconds] = useState<number>(8)
  const [hideSeconds, setHideSeconds] = useState<number>(5)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const [strategyExpanded, setStrategyExpanded] = useState<boolean>(false)

  const strategyOptions: StrategyOption[] = [
    {
      value: "alternating",
      label: "交替弹出",
      description: `弹出${showSeconds}秒，消失${hideSeconds}秒`
    },
    {
      value: "continuous",
      label: "一直弹",
      description: "持续弹出讲解，不会自动消失"
    },
    {
      value: "interval",
      label: "定时弹出",
      description: `每${intervalSeconds}秒弹一次`
    }
  ]

  // 从chrome.storage获取liveParams
  const [liveParams, setLiveParams] = useState<any>(null)

  useEffect(() => {
    chrome.storage.local.get("liveParams", (result) => {
      if (result.liveParams) {
        setLiveParams(result.liveParams)
      }
    })
  }, [])

  // 不再需要togglePromotion和isPromotionSelected方法，因为我们直接使用传入的promotions

  // 发送弹讲解请求
  const sendPromotionRequest = async (promotion: Promotion) => {
    if (!liveParams) {
      console.error("缺少必要的liveParams参数")
      return
    }

    try {
      const url = `https://buyin.jinritemai.com/api/anchor/livepc/setcurrent?verifyFp=${liveParams.verifyFp}&fp=${liveParams.fp}&msToken=${liveParams.msToken}&a_bogus=${liveParams.a_bogus}`

      const formData = new FormData()
      formData.append("promotion_id", promotion.promotion_id)
      formData.append("cancel", "false")

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })

      const data = await response.json()
      console.log("弹讲解响应:", data)
      return data
    } catch (error) {
      console.error("弹讲解请求失败:", error)
    }
  }

  // 根据策略执行弹讲解
  const executePromotionStrategy = () => {
    if (promotions.length === 0) {
      console.warn("没有选中的商品")
      return
    }

    let currentIndex = 0
    let isVisible = true

    const runPromotion = async () => {
      if (promotions.length === 0) return
      const promotion = promotions[currentIndex]

      try {
        await sendPromotionRequest(promotion)
        currentIndex = (currentIndex + 1) % promotions.length
      } catch (error) {
        console.error('弹讲解请求失败:', error)
      }
    }

    // 清除之前的定时器
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }

    // 根据不同策略设置定时器
    switch (strategy) {
      case "continuous":
        // 持续弹出：每5秒取消后重新弹出
        runPromotion()
        const continuousTimer = setInterval(async () => {
          try {
            // 发送取消请求
            const promotion = promotions[currentIndex]
            const cancelFormData = new FormData()
            cancelFormData.append("promotion_id", promotion.promotion_id)
            cancelFormData.append("cancel", "true")

            // 复用sendPromotionRequest中的URL构造逻辑
            if (!liveParams) {
              console.error("缺少必要的liveParams参数")
              return
            }

            const url = `https://buyin.jinritemai.com/api/anchor/livepc/setcurrent?verifyFp=${liveParams.verifyFp}&fp=${liveParams.fp}&msToken=${liveParams.msToken}&a_bogus=${liveParams.a_bogus}`

            // 等待取消请求完成
            await fetch(url, {
              method: "POST",
              body: cancelFormData,
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })

            // 等待重新弹出请求
            await runPromotion()
          } catch (error) {
            console.error("连续弹讲解策略执行出错:", error)
          }
        }, 5000) // 5秒间隔
        setTimerId(continuousTimer)
        break

      case "interval":
        // 定时弹出：首次立即弹出，12秒后开始计算间隔时间
        runPromotion()

        const intervalTimer = setTimeout(() => {
          // 12秒后开始计算间隔
          const timer = setInterval(() => {
            runPromotion()
          }, intervalSeconds * 1000)
          setTimerId(timer)
        }, PROMOTION_DURATION_MS) // 12秒后开始计算间隔

        setTimerId(intervalTimer)
        break

      case "alternating":
        // 交替弹出：弹出一段时间，然后消失一段时间
        runPromotion() // 初始弹出
        isVisible = true

        const alternatingTimer = setInterval(
          () => {
            if (isVisible) {
              // 当前是显示状态，需要隐藏
              // 发送取消请求
              const promotion = promotions[currentIndex]
              const formData = new FormData()
              formData.append("promotion_id", promotion.promotion_id)
              formData.append("cancel", "true")

              // 这里可以发送取消请求
              isVisible = false

              // hideSeconds后再次显示
              setTimeout(() => {
                runPromotion()
                isVisible = true
              }, hideSeconds * 1000)
            }
          },
          (showSeconds + hideSeconds) * 1000
        )

        setTimerId(alternatingTimer)
        break
    }

    setIsRunning(true)
  }

  // 停止弹讲解
  const stopPromotion = () => {
    if (timerId) {
      clearInterval(timerId)
      setTimerId(null)
    }
    setIsRunning(false)
  }

  // 更新策略参数
  const handleStrategyChange = (value: PromotionStrategy) => {
    setStrategy(value)
    setStrategyExpanded(false) // 选择策略后自动折叠面板
    if (isRunning) {
      stopPromotion()
      // 可以选择是否立即以新策略重新开始
    }
  }

  return (
    <div className="auto-promotion-container" data-testid="auto-promotion">
      {!liveParams && <div>Loading...</div>}
      <div className="strategy-section">
        <h3
          className={`section-title ${!strategyExpanded ? 'collapsed' : ''}`}
          onClick={() => setStrategyExpanded(!strategyExpanded)}
        >
          弹讲解策略
          {!strategyExpanded && (
            <span className="current-strategy">
              {strategyOptions.find(option => option.value === strategy)?.label}
              <span> - {strategyOptions.find(option => option.value === strategy)?.description}</span>
            </span>
          )}
        </h3>
        <div className={`strategy-options ${strategyExpanded ? 'expanded' : ''}`}>
          {strategyOptions.map((option) => (
            <div
              key={option.value}
              className={`strategy-option ${strategy === option.value ? "selected" : ""}`}
              onClick={() => handleStrategyChange(option.value)}>
              <div className="option-radio">
                <input
                  type="radio"
                  checked={strategy === option.value}
                  onChange={() => handleStrategyChange(option.value)}
                />
                <span className="option-label">{option.label}</span>
              </div>
              <p className="option-description">{option.description}</p>

              {option.value === "interval" && strategy === "interval" && (
                <div className="time-setting">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={intervalSeconds}
                    onChange={(e) =>
                      setIntervalSeconds(parseInt(e.target.value))
                    }
                  />
                  <span>{intervalSeconds}秒</span>
                </div>
              )}

              {option.value === "alternating" && strategy === "alternating" && (
                <div className="time-settings">
                  <div className="time-setting">
                    <label>弹出时间:</label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={showSeconds}
                      onChange={(e) => setShowSeconds(parseInt(e.target.value))}
                    />
                    <span>{showSeconds}秒</span>
                  </div>
                  <div className="time-setting">
                    <label>消失时间:</label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={hideSeconds}
                      onChange={(e) => setHideSeconds(parseInt(e.target.value))}
                    />
                    <span>{hideSeconds}秒</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="selected-promotions-section">
        <div className="section-header">
          <h3 className="section-title">已选商品</h3>
          <div className="section-actions">
            {isRunning ? (
              <button className="stop-button" onClick={stopPromotion}>
                停止
              </button>
            ) : (
              <button
                className="start-button"
                onClick={executePromotionStrategy}
                disabled={promotions.length === 0}>
                开始弹讲解
              </button>
            )}
          </div>
        </div>

        {promotions.length === 0 ? (
          <div className="empty-selected" data-testid="no-products-error">没有选中的商品</div>
        ) : (
          <div className="selected-items">
            {promotions.map((promotion) => (
              <div key={promotion.promotion_id} className="selected-item">
                <img
                  src={promotion.cover}
                  alt={promotion.title}
                  className="selected-item-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AutoPromotion
