const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const roleRoutes = require('./routes/roleRoutes')
const app = express()

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();
app.use('/api', roleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})