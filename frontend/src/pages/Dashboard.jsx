import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js"; // ✅ Decryption library
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import ChatBox from "../components/ChatBox";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET; // ✅ Must match your backend CRYPTO_SECRET

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const encrypted = await res.text(); // ✅ Get encrypted response
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY); // ✅ Decrypt
      const decrypted = bytes.toString(CryptoJS.enc.Utf8); // ✅ Convert to UTF-8 text

      if (!decrypted) throw new Error("Decryption failed. Empty string.");

      const data = JSON.parse(decrypted); // ✅ Parse JSON
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err.message || err);
    }
  };

  useEffect(() => {
    fetchTasks(); // ✅ Fetch on load
  }, []);

  const handleOpenModal = (task = null) => {
    setEditTask(task); // ✅ For edit mode
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setModalOpen(false);
    fetchTasks(); // ✅ Refresh task list after creating/editing
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Task
        </button>
      </div>

      {/* ✅ Task Columns */}
      <TaskBoard tasks={tasks} onTaskClick={handleOpenModal} />

      {/* ✅ Create/Edit Task Modal */}
      {modalOpen && (
        <TaskModal task={editTask} onClose={handleCloseModal} />
      )}

      {/* ✅ Chatbox at bottom */}
      <div className="mt-8">
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;
