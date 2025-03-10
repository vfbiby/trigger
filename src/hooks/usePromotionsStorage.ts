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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      chrome.storage.local.get("promotions", (result) => {
        // console.log("storedData", storedData)

        const { data, expires } = result.promotions
        // console.log("data", data)

        // 检查数据是否过期
        if (Date.now() > expires) {
          chrome.storage.local.set({ promotions: [] }).then((r) => {
            setPromotions([])
          })
          return
        }

        setPromotions(data?.promotions || [])
      })
    } catch (error) {
      console.error("读取localStorage数据失败:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { promotions, loading }
}
