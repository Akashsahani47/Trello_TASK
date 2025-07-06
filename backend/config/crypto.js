import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.CRYPTO_SECRET;

if (!secret) {
  throw new Error("CRYPTO_SECRET is not defined in .env file");
}

export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
  } catch (err) {
    console.error("Encryption error:", err);
    throw err;
  }
};

export const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Failed to decrypt or result is empty");
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Decryption error:", err.message);
    throw err;
  }
};
