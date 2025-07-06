import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";

import { decryptMiddleware, encryptMiddleware } from "./middleware/encryptionMiddleware.js";
import { setupSocketIO } from "./socket/chatSocket.js"; 

dotenv.config();
const app = express();
const server = http.createServer(app);

// 🔌 Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔗 Connect MongoDB
connectDB();

// 🔐 Global Middlewares
app.use(cors());
app.use(express.json());
app.use(decryptMiddleware); // Decrypt request payloads

// 📦 Routes with encryption middleware per route
app.use("/api/auth", authRoutes);
app.use("/api/tasks",  taskRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

app.use(encryptMiddleware);

// 🧠 Setup real-time communication
setupSocketIO(io);

// 🚀 Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
