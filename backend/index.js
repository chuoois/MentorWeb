require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./configs/db.connect");

const paymentsController = require("./controller/payment.controller");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- 🔧 Cấu hình CORS --------------------
const allowedOrigins = [
  "https://mentor-web-neon.vercel.app", // frontend chính
  "http://localhost:5173", // khi dev local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có Origin (VD: Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Cho phép cookie / Authorization header
  })
);

// -------------------- 🧱 Middleware --------------------
app.use(express.json()); // parse JSON body

// ✅ Bổ sung header CORS thủ công (fix cho môi trường Vercel)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://mentor-web-neon.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// -------------------- 💳 PAYOS Webhook --------------------
app.post(
  "/api/payos/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.webhook
);

// -------------------- 🚏 Routes chính --------------------
app.use("/api", routes);

// -------------------- ⚠️ 404 Handler --------------------
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not Found" });
});

// -------------------- 💥 Error Handler --------------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ ok: false, error: "CORS not allowed" });
  }
  res.status(500).json({ ok: false, error: "Internal Server Error" });
});

// -------------------- 🗄️ Connect Database & Start Server --------------------
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`[✅ API Server] http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
