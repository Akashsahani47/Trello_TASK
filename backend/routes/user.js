import express from "express";
import { getUserData } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/data", verifyToken, getUserData);

export default router;
