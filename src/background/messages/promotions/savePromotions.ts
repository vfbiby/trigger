import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const message = "promotions saved!"

  const storage = new Storage({
    area: "local"
  })

  await storage.set("promotions", req.body.promotions)

  res.send({
    message
  })
}

export default handler
