import express from "express"
import dotenv from "dotenv"
import connectDB from "./Configs/ConnectDB.js"
import authRouter from "./Routes/auth.route.js"
import userRouter from "./Routes/user.route.js"
import cookieParser from "cookie-parser"
import assistantRouter from "./Routes/assistant.route.js"
import billingRouter from "./Routes/billing.route.js"

dotenv.config()

const app = express()   // ⬅️ ye line sabse pehle, kisi bhi app.use() se pehle

// 🔄 Bulletproof CORS Middleware for both Dashboard and Assistant
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["https://motoai.onrender.com"];

  if (req.path.startsWith('/api/assistant')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    return next();
  }

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || 'https://motoai.onrender.com');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
});

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json("Hello Server")
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/billing", billingRouter)
app.use("/api/assistant", assistantRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`)
  connectDB()
})