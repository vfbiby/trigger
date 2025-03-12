import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { usePromotionsStorage } from "./hooks/usePromotionsStorage"
import "./popup.css"

const PromotionList = () => {
  const { promotions, loading } = usePromotionsStorage()

  if (loading) {
    return <div className="loading-text">加载中...</div>
  }

  if (!promotions?.length) {
    return <div className="empty-text">暂无促销数据</div>
  }

  return (
    <div className="promotion-list">
      {promotions.map((promotion) => (
        <div
          key={promotion.promotion_id}
          className="promotion-item">
          <img
            src={promotion.cover}
            alt={promotion.title}
            className="promotion-image"
          />
          <div className="promotion-content">
            <h3 className="promotion-title">{promotion.title}</h3>
            <p className="promotion-price">
              ¥{(promotion.price_desc.min_price.origin / 100).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function IndexPopup() {
  const [greeting, setGreeting] = useState("")

  async function handlePing() {
    const resp = await sendToBackground({
      name: "ping"
    });
    setGreeting(resp.promotions)
  }

  return (
    <div className="popup-container">
      <h1 className="page-title">当前促销商品</h1>
      <PromotionList />
    </div>
  )
}

export default IndexPopup
