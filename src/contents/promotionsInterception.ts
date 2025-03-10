import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"

interface CustomXHR extends XMLHttpRequest {
  _originalUrl?: string
  _requestBody?: any
  _method?: string
  _headers?: Record<string, string>
}

export const config: PlasmoCSConfig = {
  matches: ["*://buyin.jinritemai.com/*"],
  run_at: "document_start",
  world: "MAIN",
}

const interceptUrls = [
  {
    // 精确匹配包含promotions_v2的API路径，忽略查询参数和域名
    pattern: /\/api\/anchor\/livepc\/promotions_v2[^/]*$/i,
    type: "PROMOTIONS_V2"
  }
]

// 最小化安全拦截方案
function interceptAjax() {
  // 仅添加事件监听不修改原型方法
  const originalSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this as CustomXHR

    // 保留原始send方法
    const sendResult = originalSend.apply(this, arguments)

    // 安全添加事件监听
    xhr.addEventListener("readystatechange", function (event) {
      try {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const finalUrl = xhr.responseURL || xhr._originalUrl

          // 仅在匹配目标URL时记录
          if (interceptUrls.some((i) => i.pattern.test(finalUrl))) {
            sendResponseBack("PROMOTIONS_V2", event)
            log("检测到目标请求", {
              status: xhr.status,
              method: xhr._method,
              url: finalUrl
            })
          }
        }
      } catch (e) {
        console.error("安全拦截异常:", e)
      }
    })

    return sendResult
  }

}

function sendResponseBack(type: string, event) {
  const responseText = event.target.responseText
  log(responseText)

  try {
    const data = JSON.parse(responseText)
    // 存储完整的API响应数据并添加类型
    const storageData = {
      timestamp: Date.now(),
      expires: Date.now() + 3600000, // 1小时有效期
      data: data?.data || null
    }

    if (data?.data?.promotions) {
      window.dispatchEvent(
        new CustomEvent("FROM_INJECTED", {
          detail: {
            type,
            responseText,
            data: storageData
          }
        })
      )
    }
  } catch (e) {
    console.error("处理促销数据失败:", e)
  }
}

// 初始化拦截器
function initInterceptor() {
  // 简化后的安装逻辑
  interceptAjax()
  log("XHR拦截器安装成功", {
    timestamp: performance.now(),
    navigationStart: performance.timing.navigationStart
  })
}

document.addEventListener("DOMContentLoaded", initInterceptor)
