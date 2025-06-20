import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const { socket } = useAuth();

  // const getUsers = async () => {
  //   setIsUsersLoading(true);
  //   try {
  //     const res = await axiosInstance.get("/messages/users");
  //     setUsers(res.data);
  //   } catch (err) {
  //     toast.error(err.response.data.message);
  //   } finally {
  //     setIsUsersLoading(false);
  //   }
  // };

  // const getMessages = async (userId) => {
  //   setIsMessagesLoading(true);
  //   try {
  //     const res = await axiosInstance.get(`/messages/${userId}`);
  //     setMessages(res.data);
  //   } catch (err) {
  //     toast.error(err.response.data.message);
  //   } finally {
  //     setIsMessagesLoading(false);
  //   }
  // };

  // const sendMessage = async (messageData) => {
  //   try {
  //     const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
  //     setMessages((prev) => [...prev, res.data]);
  //   } catch (err) {
  //     toast.error(err.response.data.message);
  //   }
  // };


  const getMessages = useCallback(async (userId) => {
  setIsMessagesLoading(true);
  try {
    const res = await axiosInstance.get(`/messages/${userId}`);
    setMessages(res.data);
  } catch (err) {
    toast.error(err.response.data.message);
  } finally {
    setIsMessagesLoading(false);
  }
}, []);

const getUsers = useCallback(async () => {
  setIsUsersLoading(true);
  try {
    const res = await axiosInstance.get("/messages/users");
    setUsers(res.data);
  } catch (err) {
    toast.error(err.response.data.message);
  } finally {
    setIsUsersLoading(false);
  }
}, []);

const sendMessage = useCallback(async (messageData) => {
  try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    setMessages((prev) => [...prev, res.data]);
  } catch (err) {
    toast.error(err.response.data.message);
  }
}, [selectedUser?._id]);



  // const subscribeToMessages = useCallback(() => {
  //   if (!selectedUser || !socket) return;

  //   socket.on("newMessage", (newMessage) => {
  //     const isFromSelectedUser = newMessage.senderId === selectedUser._id;
  //     if (!isFromSelectedUser) return;
  //     setMessages((prev) => [...prev, newMessage]);
  //   });
  // },[])

  // const unsubscribeFromMessages = useCallback(() => {
  //   if (!socket) return;
  //   socket.off("newMessage");
  // },[])


  const subscribeToMessages = useCallback(() => {
  if (!selectedUser || !socket) return;

  socket.on("newMessage", (newMessage) => {
    const isFromSelectedUser = newMessage.senderId === selectedUser._id;
    if (!isFromSelectedUser) return;
    setMessages((prev) => [...prev, newMessage]);
  });
}, [selectedUser, socket]);

const unsubscribeFromMessages = useCallback(() => {
  if (!socket) return;
  socket.off("newMessage");
}, [socket]);


  const value = useMemo(() => ({
  users,
  getUsers,
  isUsersLoading,
  messages,
  getMessages,
  isMessagesLoading,
  selectedUser,
  setSelectedUser,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages
}), [
  users,
  getUsers,
  isUsersLoading,
  messages,
  getMessages,
  isMessagesLoading,
  selectedUser,
  sendMessage,
  subscribeToMessages,
  unsubscribeFromMessages
]);


  return (
    <ChatContext.Provider
      value={value}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
