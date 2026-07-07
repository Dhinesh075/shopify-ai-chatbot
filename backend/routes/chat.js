import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chat API is working!"
  });
});

router.post("/", chat);

export default router;