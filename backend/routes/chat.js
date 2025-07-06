import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/send", verifyToken, sendMessage);
router.get("/:user1/:user2", verifyToken, getMessages);

export default router;
