import { useState } from "react"

import type { Promotion } from "~src/hooks/usePromotionsStorage.js"

interface EnhancedPromotionListProps {
  promotions: Promotion[]
  selectedPromotions: Promotion[]
  onTogglePromotion: (promotion: Promotion) => void
}

const EnhancedPromotionList: React.FC<EnhancedPromotionListProps> = ({
  promotions,
  selectedPromotions,
  onTogglePromotion
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // 检查商品是否已选中
  const isPromotionSelected = (promotion: Promotion) => {
    return selectedPromotions.some(
      (p) => p.promotion_id === promotion.promotion_id
    )
  }

  if (!promotions?.length) {
    return <div className="empty-text">暂无促销数据</div>
  }

  return (
    <div>
      <div className="view-toggle">
        <button
          className={`view-toggle-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}>
          列表
        </button>
        <button
          className={`view-toggle-button ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}>
          缩略图
        </button>
      </div>

      {viewMode === "list" ? (
        <div className="promotion-list">
          {promotions.map((promotion) => (
            <div
              key={promotion.promotion_id}
              className="promotion-item"
              onClick={() => onTogglePromotion(promotion)}>
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
              <button
                className={`select-button ${isPromotionSelected(promotion) ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePromotion(promotion)
                }}>
                {isPromotionSelected(promotion) ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="promotion-grid">
          {promotions.map((promotion) => (
            <div
              key={promotion.promotion_id}
              className="promotion-grid-item"
              onClick={() => onTogglePromotion(promotion)}>
              <img
                src={promotion.cover}
                alt={promotion.title}
                className="promotion-grid-image"
              />
              <div className="promotion-grid-content">
                <h3 className="promotion-grid-title">{promotion.title}</h3>
                <p className="promotion-grid-price">
                  ¥{(promotion.price_desc.min_price.origin / 100).toFixed(2)}
                </p>
              </div>
              <button
                className={`select-button ${isPromotionSelected(promotion) ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePromotion(promotion)
                }}>
                {isPromotionSelected(promotion) ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnhancedPromotionList
