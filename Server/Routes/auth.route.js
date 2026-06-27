import express from "express";
// 1. Apne controllers ko sahi se import karein
import { googleAuth, logout } from "../Controllers/auth.controller.js"; 

const router = express.Router();

// 2. Yahan temporary function hatakar asli googleAuth controller lagayein
router.post("/google", googleAuth); 

// 3. Logout route bhi attach kar dete hain future ke liye
router.get("/logout", logout);

export default router;