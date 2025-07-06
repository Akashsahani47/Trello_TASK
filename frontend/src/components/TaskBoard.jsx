import React from "react";
import TaskCard from "./TaskCard";

const TaskBoard = ({ tasks, onTaskClick }) => {
  const statuses = ["To Do", "In Progress", "Completed"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statuses.map((status) => (
        <div key={status} className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-2">{status}</h2>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
