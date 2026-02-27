const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}))

app.use(express.json())

const itemRouter = require('./routes/itemRoutes')

app.use('/items', itemRouter)

app.listen(3000, () => {
    console.log('Running on port 3000')
})