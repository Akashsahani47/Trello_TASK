import express from "express";
import { signup, login, isAuth } from "../controllers/authController.js";
import { decryptMiddleware } from "../middleware/encryptionMiddleware.js";

const router = express.Router();

router.post("/signup",decryptMiddleware, signup);
router.post("/login",decryptMiddleware, login);
router.get("/is_Auth", isAuth);

export default router;
