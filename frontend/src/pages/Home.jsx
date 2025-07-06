import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Trello Lite</h1>
        <p className="text-gray-600 mb-6">
          A simplified task management system to track your tasks and collaborate in real time.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906334.png"
          alt="Trello Icon"
          className="w-24 h-24 mx-auto mb-6"
        />
        <button
          onClick={() => navigate("/auth")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
        >
          Get Started / Login
        </button>
      </div>
    </div>
  );
};

export default Landing;
