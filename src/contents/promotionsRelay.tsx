import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://buyin.jinritemai.com/*"]
}

const PromotionsRelay = () => {
  function onMessageListener(e: any) {
    if (e.detail.type === "PROMOTIONS") {
      chrome.storage.local.set({ promotions: e.detail.data }).then((r) => {
        console.log("promotions_v2 data saved")
      })
    }

    // if (e.detail.type === "SET_CURRENT"){
    if (e.detail.type === "PROMOTIONS" || e.detail.type === "SET_CURRENT") {
      console.log("set current url", e.detail.url)
      const urlParams = new URL(e.detail.url).searchParams
      console.log(urlParams)

      // 存储到本地存储
      const verifyFp = urlParams.get("verifyFp")
      const fp = urlParams.get("fp")
      const msToken = urlParams.get("msToken")
      const aBogus = urlParams.get("a_bogus")

      const liveParams = { verifyFp, fp, msToken, a_bogus: aBogus }

      if (verifyFp && fp && msToken && aBogus) {
        chrome.storage.local
          .set({
            liveParams: liveParams
          })
          .then(() => {
            console.log("liveParams data saved", liveParams)
          })
      }
    }
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
