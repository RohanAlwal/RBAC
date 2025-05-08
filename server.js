const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const app = express()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})