import { useEffect, useState } from "react"

export interface Promotion {
  promotion_id: string
  title: string
  cover: string
  price_desc: {
    min_price: {
      origin: number
    }
  }
}

export const usePromotionsStorage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("promotions_v2");
      if (storedData) {
        const { data, expires } = JSON.parse(storedData);
        
        // 检查数据是否过期
        if (Date.now() > expires) {
          localStorage.removeItem("promotions_v2");
          setPromotions([]);
          return;
        }
        
        setPromotions(data?.promotions || []);
      }
    } catch (error) {
      console.error("读取localStorage数据失败:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { promotions, loading }
}
