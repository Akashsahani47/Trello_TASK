import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContentProvider } from "./context/AppContent"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContentProvider>
      <App />
    </AppContentProvider>
  </React.StrictMode>
);