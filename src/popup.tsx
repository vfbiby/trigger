import { usePromotionsStorage } from "./hooks/usePromotionsStorage"

const PromotionList = () => {
  const { promotions, loading } = usePromotionsStorage()

  if (loading) {
    return <div className="p-4 text-gray-500">加载中...</div>
  }

  if (!promotions?.length) {
    return <div className="p-4 text-gray-500">暂无促销数据</div>
  }

  return (
    <div className="divide-y">
      {promotions.map((promotion) => (
        <div key={promotion.promotion_id} className="flex items-center p-4 gap-4">
          <img 
            src={promotion.cover} 
            alt={promotion.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-medium line-clamp-2">{promotion.title}</h3>
            <p className="text-red-500 mt-1">
              ¥{(promotion.price_desc.min_price.origin / 100).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function IndexPopup() {
  return (
    <div style={{ width: 400, padding: 16 }}>
      <h1 className="text-lg font-bold mb-4">当前促销商品</h1>
      <PromotionList />
    </div>
  )
}

export default IndexPopup
