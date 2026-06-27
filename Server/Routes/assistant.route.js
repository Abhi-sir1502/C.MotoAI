import express from "express";
import { getAssistantConfig } from "../Controllers/assistant.controller.js";
// FIXED: Path ko wapas auth.controller.js kar diya jahan aapka function physical present hai
import { askAssistant } from "../Controllers/auth.controller.js"; 

const assistantRouter = express.Router();

assistantRouter.get("/config/:userId", getAssistantConfig);
assistantRouter.post("/ask", askAssistant);   

export default assistantRouter;