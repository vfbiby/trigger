import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = "hello"

  const storage = new Storage({
    area: "local"
  })

  const promotions = await storage.get("key")

  res.send({
    message,
    promotions
  })
}

export default handler
