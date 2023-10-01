import express from 'express'
import db from './db.js'

const app = express()

const PORT = process.env.PORT || 8080

app.get('/users/:username', async (req, res) => {
  const { username } = req.params
  try {
    const data = await db.getUserByUserName(username)
    if (data) {
      res.json(data)
    }
    res.status(404).send(null)
  } catch (err) {
    res.status(500).json(err)
  }
})
// app.listen(PORT, function () {
//   console.log(`Server is listening on port http://localhost:${PORT}`)
// })

export { app }
