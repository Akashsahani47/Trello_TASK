import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";   

export const AppContent = createContext();

export const AppContentProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  
  const login = (token, role) => {
    setToken(token);
    setRole(role);
    setIsLoggedin(true);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  // Logout
  const logout = () => {
    setToken(null);
    setRole(null);
    setIsLoggedin(false);
    setUserData(null);
    localStorage.clear();
  };

  // Get logged-in user's data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      data.success ? setUserData(data.userdata) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Check if token is valid (Auth check)
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is_Auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) getAuthState();
  }, [token]);

  return (
    <AppContent.Provider
      value={{
        backendUrl,
        isLoggedin,
        userData,
        token,
        role,
        login,
        logout,
        getUserData,
        setIsLoggedin,
        setUserData,
      }}
    >
      {children}
    </AppContent.Provider>
  );
};
