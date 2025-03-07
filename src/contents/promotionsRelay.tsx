import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://buyin.jinritemai.com/*"]
}

const PromotionsRelay = () => {

  function onMessageListener(e: any) {
    chrome.storage.local.set({ promotions: e.detail.data }).then((r) => {
      console.log("promotions_v2 data saved", e.detail.data)
    })
  }

  useEffect(() => {
    window.addEventListener("FROM_INJECTED", onMessageListener, false)
    return () => {
      window.removeEventListener("FROM_INJECTED", onMessageListener)
    }
  }, [])
  return <div></div>
}

export default PromotionsRelay
