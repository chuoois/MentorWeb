require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./configs/db.connect');
const PORT = process.env.PORT || 3000;
const app = express();
const routes = require('./routes/index');

// Middleware phải khai báo trước routes
app.use(cors());
app.use(express.json()); // parse JSON body

// Routes
app.use('/api', routes);

// 404 cho các route không khớp
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1); });
