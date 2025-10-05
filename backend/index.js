require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./configs/db.connect');
const { errorHandler } = require('./middleware/error.middleware.js');

// Routers
const authRoutes            = require('./routes/auth.routes.js');
const userRoutes            = require('./routes/users.routes.js');
const menteeRoutes          = require('./routes/mentee.routes.js');
const mentorRoutes          = require('./routes/mentors.routes.js');
const mentorPricingRoutes   = require('./routes/mentorPricing.routes.js');  // +++
const mentorOrdersRoutes    = require('./routes/mentorOrders.routes.js');   // +++
const mentorFeedbackRoutes  = require('./routes/mentorFeedback.routes.js'); // +++
const mentorChatsRoutes     = require('./routes/mentorChats.routes.js');    // +++
const adminRoutes           = require('./routes/admin.routes.js');

const PORT = process.env.PORT || 3000;

const app = express();

// CORS: chỉ khai báo 1 lần
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());

// (tuỳ chọn) log request để debug
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ========= Public/Business routes ========= */
app.use('/auth',    authRoutes);
app.use('/users',   userRoutes);
app.use('/mentees', menteeRoutes);
app.use('/mentors', mentorRoutes);

// Mount các module còn thiếu
app.use('/pricing',  mentorPricingRoutes);   // /pricing/...
app.use('/orders',   mentorOrdersRoutes);    // /orders/...
app.use('/feedback', mentorFeedbackRoutes);  // /feedback/...
app.use('/chats',    mentorChatsRoutes);     // /chats/...

/* ========= Admin routes (đã có middleware trong file router) ========= */
app.use('/admin', adminRoutes);

// 404 cho các route không khớp
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

// Error handler cuối
app.use(errorHandler);

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1); });
