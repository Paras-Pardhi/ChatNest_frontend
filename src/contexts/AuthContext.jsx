import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AuthContext = createContext();
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chatnest-backend-iv9h.onrender.com";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = (userId) => {
    if (socket?.connected) return;
    const socketInstance = io(BASE_URL, {
      query: { userId }
    });
    socketInstance.connect();
    socketInstance.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
    setSocket(socketInstance);
  };

  const disconnectSocket = () => {
    socket?.disconnect();
    setSocket(null);
  };

 const checkAuth = useCallback(async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    setAuthUser(res.data);
    connectSocket(res.data._id);
  } catch {
    setAuthUser(null);
  } finally {
    setIsCheckingAuth(false);
  }
}, []);

  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      setAuthUser(res.data);
      toast.success("Account created successfully");
      connectSocket(res.data._id);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setAuthUser(res.data);
      toast.success("Logged in successfully");
      connectSocket(res.data._id);
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully");
      disconnectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setAuthUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser, setAuthUser,
        isCheckingAuth, isLoggingIn, isSigningUp, isUpdatingProfile,
        onlineUsers, socket,
        checkAuth, login, logout, signup, updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
