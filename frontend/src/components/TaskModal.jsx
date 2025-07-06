import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = "qwertyuiop"; // must match the backend

const TaskModal = ({ task, onClose }) => {
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "To Do",
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        ...task,
        dueDate: task.dueDate?.split("T")[0] || "",
      });
    }
  }, [task, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const decryptResponse = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  };

  const handleSubmit = async () => {
    const url = isEdit
      ? `http://localhost:3000/api/tasks/${task._id}`
      : "http://localhost:3000/api/tasks";

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const encrypted = await res.text();

      if (!res.ok) {
        console.error("❌ Server responded with error:", encrypted);
        alert("Error: " + encrypted);
        return;
      }

      if (!encrypted) {
        throw new Error("Empty response from server");
      }

      const data = decryptResponse(encrypted);
      alert(data.message || "Success");

      // close modal and trigger fetchTasks in Dashboard
      onClose();
    } catch (err) {
      console.error("Error submitting task:", err.message);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Task" : "Create Task"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full mb-2 p-2 border"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full mb-2 p-2 border"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="status"
          className="w-full mb-2 p-2 border"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          name="dueDate"
          className="w-full mb-2 p-2 border"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
