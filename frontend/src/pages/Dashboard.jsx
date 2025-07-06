import React, { useEffect, useState, useContext } from "react";
import CryptoJS from "crypto-js";
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import ChatBox from "../components/ChatBox";
import { AppContent } from "../context/AppContent";
import { useNavigate } from "react-router-dom";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const { logout } = useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const encrypted = await res.text();
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Decryption failed. Empty string.");

      const data = JSON.parse(decrypted);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err.message || err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenModal = (task = null) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setModalOpen(false);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <TaskBoard tasks={tasks} onTaskClick={handleOpenModal} />

      {modalOpen && (
        <TaskModal task={editTask} onClose={handleCloseModal} />
      )}

      <div className="mt-8">
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;
