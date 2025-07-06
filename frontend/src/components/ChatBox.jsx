import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, { sender: "You", message: msg }]);
    setMsg("");
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-2">Live Chat</h2>
      <div className="border p-2 h-40 overflow-y-auto mb-2 bg-white rounded">
        {messages.map((m, idx) => (
          <div key={idx} className="text-sm">
            <strong>{m.sender}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type message..."
          className="border p-2 flex-1 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
