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

const app = express()

// 🔥 BADLAV 1: CORS ko globally sabse upar lagayein
// Yeh private aur public dono ka kaam automatic handle karega bina kisi error ke
app.use(cors({
  origin: ["https://motoai.onrender.com"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())
app.use(cookieParser())

app.get("/" , (req, res)=> {
    res.json("Hello from Server")
})

// Routes ab bilkul clean rahenge
app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/billing" , billingRouter)
app.use("/api/assistant" , assistantRouter)

const PORT = process.env.PORT
app.listen(PORT , ()=>{
    console.log(`Server Started on PORT ${PORT}`) 
    connectDB()
})