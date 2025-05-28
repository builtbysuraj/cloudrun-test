import { Client } from 'basic-ftp'
import cors from 'cors'
import express from 'express'
import fetch from 'node-fetch'

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  let egressIp = 'N/A'
  let ftpStatus = 'Failed to connect to FTP.'
  let ftpFileList = []

  // Get Egress IP
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const ip = await response.json()
    egressIp = ip.ip
  } catch (error) {
    console.error('Error fetching egress IP:', error)
    egressIp = `Error: ${error.message}`
  }

  const client = new Client()
  // client.ftp.verbose = true; // Uncomment for detailed FTP logs (useful for debugging)

  try {
    await client.access({
      host: '34.93.189.158',
      user: 'mine',
      password: '6296371937',
      secure: false,
    })

    ftpFileList = await client.list()
    ftpStatus = 'Successfully connected to FTP and listed files.'
    console.log(
      'FTP files:',
      ftpFileList.map((f) => f.name)
    )
  } catch (error) {
    console.error('FTP Error:', error)
    ftpStatus = `FTP Connection Error: ${error.message}`
    // Common errors if IP is not whitelisted: "530 Login authentication failed"
    // or timeout errors if connection is blocked.
  } finally {
    client.close()
  }

  res.json({
    egressIp: egressIp,
    ftpCheck: {
      status: ftpStatus,
      fileList: ftpFileList.map((f) => f.name), // Sending just names for brevity
    },
  })
})

app.listen(PORT, () => {
  console.log('Server running on:', PORT)
})
