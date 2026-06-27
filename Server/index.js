import express from "express"
import dotenv from "dotenv"
import connectDB from "./Configs/ConnectDB.js"
import authRouter from "./Routes/auth.route.js"
import userRouter from "./Routes/user.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import assistantRouter from "./Routes/assistant.route.js"
import billingRouter from "./Routes/billing.route.js"

dotenv.config()

// 🔥 HAMEIN IS LINE KO SABSE UPAR RAKHNA HAI:
const app = express()

// 🔄 Dynamic CORS Middleware (Ab yeh bilkul sahi chalega kyunki 'app' upar define ho chuka hai)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/assistant')) {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    return next();
  }
  
  cors({
    origin: ["https://motoai.onrender.com"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })(req, res, next);
});

app.use(express.json())
app.use(cookieParser())

app.get("/" , (req, res)=> {
    res.json("Hello from Server")
})

// Routes
app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/billing" , billingRouter)
app.use("/api/assistant" , assistantRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT , ()=>{
    console.log(`Server Started on PORT ${PORT}`) 
    connectDB()
})