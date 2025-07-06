// middleware/encryptionMiddleware.js
import { encryptData, decryptData } from "../config/crypto.js";

// 🔐 Decrypt incoming request
export const decryptMiddleware = (req, res, next) => {
  if (req.body?.data) {
    try {
      req.body = decryptData(req.body.data);
    } catch (err) {
      return res.status(400).json({ message: "Invalid encrypted request" });
    }
  }
  next();
};

// 🔐 Encrypt outgoing response
export const encryptMiddleware = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    try {
      const encrypted = encryptData(data);
      return originalSend.call(this, encrypted);
    } catch (err) {
      return originalSend.call(this, JSON.stringify({ message: "Encryption failed" }));
    }
  };
  next();
};
