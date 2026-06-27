import { razorpay } from "../Configs/razorpay.js";
import Billing from "../Models/billing.model.js";
import User from "../Models/user.model.js";   
import crypto from "crypto";

// 1. Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId; 
    let amount = 0;

    if (plan === "pro") {
      amount = 699;
    } else {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`, 
    });

    // Model me spelling orderId (single 'e') karne ke baad yeh sahi save hoga
    await Billing.create({
      userId,
      amount,
      plan,
      orderId: order.id 
    });

    return res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

// 2. Verify Razorpay payment signature (Aapke original code ke hisab se setup)
export const verifyBilling = async (req, res) => {
  try {
    // Frontend direct response bhej raha hai, toh keys ke naam yahi honge:
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.userId;

    // Signature verify karne ka tarika
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id) 
      .digest("hex"); 

    if (sign !== razorpay_signature) { 
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Database mein update (Spelling model me orderId honi chahiye ab)
    await Billing.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "paid" }
    );

    // User ka plan upgrade (90 days calculation)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        plan: "pro",
        proExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    return res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};