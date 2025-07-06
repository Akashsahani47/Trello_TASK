import React from "react";

const TaskCard = ({ task, onClick }) => (
  <div
    onClick={onClick}
    className="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-100"
  >
    <h3 className="font-semibold">{task.title}</h3>
    <p className="text-sm text-gray-600">{task.description}</p>
    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
  </div>
);

export default TaskCard;
