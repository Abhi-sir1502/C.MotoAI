// Razorpay client setup
import Razorpay from 'razorpay'
import dotenv from "dotenv"
dotenv.config()

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // fix: kEY_ID -> KEY_ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // fix: secRET -> secret
});