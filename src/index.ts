import Express from "express"
import { getFrameCount } from "./use-cases"

const PORT = 3002

const app = Express()

app.get("/internal/healthcheck", (_req, res) => {
  res.status(200).send("success")
})

app.post("/file-upload", (req, res) => {
  var data = Buffer.from("")
  req.on("data", (chunk) => {
    data = Buffer.concat([data, chunk])
  })
  req.on("end", () => {
    try {
      const frameCount = getFrameCount
      res.status(200).send({ frameCount })
    } catch (err) {
      res.status(500).send("An unexpected error occured")
    }
  })
})

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))
