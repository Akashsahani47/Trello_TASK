import Task from "../models/Task.js";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "qwertyuiop";

// Encrypt utility
const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // ✅ both admin and user can see all tasks
    res.send(encrypt({ tasks }));
  } catch (err) {
    res.send(encrypt({ message: "Failed to fetch tasks" }));
  }
};


// CREATE task (admin only)
export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send(encrypt({ message: "Only admin can create tasks" }));
    }

    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      createdBy: req.user.userId,
    });

    await task.save();

    res.status(201).send(encrypt({ message: "Task created", task }));
  } catch (err) {
    res.status(500).send(encrypt({ message: "Failed to create task" }));
  }
};

// UPDATE task (user/admin) → notify admin if user
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send(encrypt({ message: "Task not found" }));
    }

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.status = status;
    await task.save();

    if (req.user.role === "user") {
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: admin.email,
          subject: "📢 Task Updated by User",
          text: `A task was updated by a user.\n\nTitle: ${title}\nStatus: ${status}\nDue: ${dueDate}`,
        });
      }
    }

    res.status(200).send(encrypt({ message: "Task updated", task }));
  } catch (err) {
    res.status(500).send(encrypt({ message: "Server error" }));
  }
};

// DELETE task (admin only)
export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send(encrypt({ message: "Only admin can delete tasks" }));
    }

    const { id } = req.params;
    await Task.findByIdAndDelete(id);

    res.status(200).send(encrypt({ message: "Task deleted" }));
  } catch (err) {
    res.status(500).send(encrypt({ message: "Failed to delete task" }));
  }
};
