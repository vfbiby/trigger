import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["*://buyin.jinritemai.com/*"]
}

const PromotionsRelay = () => {
  function onMessageListener(e: any) {
    if (e.detail.type === "PROMOTIONS") {
      console.log(e.detail.url)
      chrome.storage.local.set({ promotions: e.detail.data }).then((r) => {
        console.log("promotions_v2 data saved")
      })
    }

    // if (e.detail.type === "SET_CURRENT"){
    if (e.detail.type === "PROMOTIONS") {
      const urlParams = new URL(e.detail.url).searchParams

      // 存储到本地存储
      chrome.storage.local
        .set({
          liveParams: {
            verifyFp: urlParams.get("verifyFp"),
            fp: urlParams.get("fp"),
            msToken: urlParams.get("msToken"),
            a_bogus: urlParams.get("a_bogus")
          }
        })
        .then(() => {
          console.log("liveParams data saved")
        })
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
