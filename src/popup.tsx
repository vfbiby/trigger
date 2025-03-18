import { useState } from "react"

import AutoPromotion from "./components/AutoPromotion.tsx"
import EnhancedPromotionList from "./components/EnhancedPromotionList.tsx"
import {
  usePromotionsStorage,
  type Promotion
} from "./hooks/usePromotionsStorage.ts"

import "./popup.css"
import "./components/AutoPromotion.css"

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
      <h1 className="page-title">当前促销商品</h1>
      <div className="selected-promotions-sticky">
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
