import Task from "../models/Task.js";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import { encryptData } from "../config/crypto.js";



// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks =
      req.user.role === "admin"
        ? await Task.find()
        : await Task.find({ createdBy: req.user.userId });

    const encrypted = encryptData({ tasks });
    res.send(encrypted);
  } catch (err) {
    const encrypted = encryptData({ message: "Failed to fetch tasks" });
    res.send(encrypted);
  }
};




// POST create task (Admin only)
export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create tasks" });
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
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};




// PUT update task (User & Admin)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.status = status;
    await task.save();

    // If updated by user, notify admin
    if (req.user.role === "user") {
      const admin = await User.findOne({ role: "admin" });

      if (admin) {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: process.env.ADMIN_EMAIL,
          subject: "Task Updated",
          text: `A task titled '${task.title}' was updated by a user.`,
        });
      }
    }

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};




// DELETE task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    const { id } = req.params;
    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
