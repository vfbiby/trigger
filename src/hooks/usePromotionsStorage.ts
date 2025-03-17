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
    const handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
      if (areaName === 'local' && changes.promotions) {
        const newValue = changes.promotions.newValue
        if (!newValue) {
          setPromotions([])
          return
        }
        
        const { data, expires } = newValue
        if (Date.now() > expires) {
          setPromotions([])
          return
        }
        setPromotions(data?.promotions || [])
      }
    }

    try {
      // 初始化获取数据
      chrome.storage.local.get("promotions", (result) => {
        const { data, expires } = result.promotions || {}
        if (Date.now() > expires) {
          chrome.storage.local.set({ promotions: [] }).then((r) => {
            setPromotions([])
          })
          return
        }
        setPromotions(data?.promotions || [])
      })

      // 添加storage变化监听
      chrome.storage.onChanged.addListener(handleStorageChange)
    } catch (error) {
      console.error("读取localStorage数据失败:", error)
    } finally {
      setLoading(false)
    }

    // 清理监听
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const updatePromotions = async (newPromotions: Promotion[]) => {
    const storagePromise = chrome.storage.local.set({
      promotions: {
        data: { promotions: newPromotions },
        expires: Date.now() + 1000 * 60 * 60 // 1 hour
      }
    })
    // 等待storage设置完成后再更新本地状态
    await storagePromise
    setPromotions(newPromotions)
  }

  return { promotions, loading, updatePromotions }
}
