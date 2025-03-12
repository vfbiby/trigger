import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import AutoPromotion from "./components/AutoPromotion"
import EnhancedPromotionList from "./components/EnhancedPromotionList"
import {
  usePromotionsStorage,
  type Promotion
} from "./hooks/usePromotionsStorage"

import "./popup.css"
import "./components/AutoPromotion.css"

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
        <div key={promotion.promotion_id} className="promotion-item">
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
  const { promotions, loading } = usePromotionsStorage()
  const [selectedPromotions, setSelectedPromotions] = useState<Promotion[]>([])

  // 添加或移除商品
  const handleTogglePromotion = (promotion: Promotion) => {
    setSelectedPromotions((prev) => {
      const exists = prev.some((p) => p.promotion_id === promotion.promotion_id)
      if (exists) {
        return prev.filter((p) => p.promotion_id !== promotion.promotion_id)
      } else {
        return [...prev, promotion]
      }
    })
  }

  return (
    <div className="popup-container">
      <div className="sticky-header">
        <h1 className="page-title">当前促销商品</h1>
        <AutoPromotion promotions={selectedPromotions} />
      </div>
      {loading ? (
        <div className="loading-text">加载中...</div>
      ) : (
        <EnhancedPromotionList
          promotions={promotions}
          selectedPromotions={selectedPromotions}
          onTogglePromotion={handleTogglePromotion}
        />
      )}
    </div>
  )
}

export default IndexPopup
