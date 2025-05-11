const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const {loadPermissionsToCache} = require('./utils/permissionCache');
const app = express()

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();
app.use('/api', roleRoutes);
app.use('/api/auth', authRoutes);

(async () => {
  await loadPermissionsToCache(); // Initial load before routes run

  // 🔁 Auto-refresh cache every 10 minutes
  setInterval(() => {
    console.log('Refreshing permission cache...');
    loadPermissionsToCache();
  }, 10 * 60 * 1000);

  app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
})();
