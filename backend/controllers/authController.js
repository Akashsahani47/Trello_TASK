import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { encryptData } from "../config/crypto.js"; // ✅ Import encryption

// Signup
export const signup = async (req, res) => {
  try {
    const { email, password, age, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const encrypted = encryptData({ message: "Email already registered" });
      return res.status(400).send(encrypted);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, age, role });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = {
      token,
      role: newUser.role,
      message: "Signup successful"
    };

    const encrypted = encryptData(response);
    return res.status(201).send(encrypted);
  } catch (err) {
    const encrypted = encryptData({ message: "Server error" });
    return res.status(500).send(encrypted);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password , role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const encrypted = encryptData({ message: "User not found" });
      return res.status(404).send(encrypted);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const encrypted = encryptData({ message: "Invalid credentials" });
      return res.status(401).send(encrypted);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = {
      token,
      role: user.role,
      message: "Login successful"
    };

    const encrypted = encryptData(response);
    return res.status(200).send(encrypted);
  } catch (err) {
    const encrypted = encryptData({ message: "Server error" });
    return res.status(500).send(encrypted);
  }
};

// Auth check
export const isAuth = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({ success: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
