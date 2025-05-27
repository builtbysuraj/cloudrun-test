import cors from 'cors'
import express from 'express'
import fetch from 'node-fetch'

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  const response = await fetch('https://api.ipify.org?format=json')
  const ip = await response.json()
  res.send(`Egress IP: ${ip.ip}`)
})

app.listen(PORT, () => {
  console.log('Server running on: ', PORT)
})
