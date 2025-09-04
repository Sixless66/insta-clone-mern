import React, { useEffect, useState, useContext, useCallback } from "react";
import { PostContext } from "./PostContext";
import toast from "react-hot-toast";
import { UserContext } from "./UserContext";
import axios from "axios";
import { SocketContext } from "./SocketContext";
import { useLocation } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.headers.common["token"] = localStorage.getItem("token");
axios.defaults.baseURL = backendUrl;

const PostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isSeen, setIsSeen] = useState(false);
  const location = useLocation();

  const { selectedUser, authUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext)

  const createPost = async (body) => {
       try {
            const { data } = await axios.post('/api/post/create', body);
            if(data.success) {
               setFeedPosts((prev) => ([data.post,...prev]));
               toast.success(data.message)
            }
       } catch (error) {
           toast.error(error.message)
       }
  }

  const getFeedPosts = async () => {
    try {
      const { data } = await axios.get("/api/post/feeds");
      if (data.success) setFeedPosts(data.posts);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const likePost = async (postId) => {
    try {
      const { data } = await axios.post(`/api/post/${postId}/like`);
      if (data.success) {
          toast.success(data.message);
      }; 
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMyPosts = async () => {
    try {
      const id = selectedUser ? selectedUser._id : authUser._id;
      const { data } = await axios.get(`/api/post/posts?id=${id}`);
      if (data.success) setMyPosts(data.posts);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notification");
      if (data.success) {
        setNotifications(data.unseenMessages || []);
        setNotificationCount(data.count);
        if (data.message) toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markNotificationSeen = async () => {
        try {
            const { data } = await axios.put(`/api/notification/mark`);
            if(data.success) {
               setIsSeen(true);
               setNotificationCount(0);
               toast.success(data.message);
            }
        } catch (error) {
           toast.error(error.message)
        }
    } 


  useEffect(() => {
     if(!isSeen && authUser){
        getNotifications();
     }
  }, [])

  const handleNotification = useCallback((notification) => {
  setNotifications((prev) => [notification, ...prev]);

  if (location.pathname !== "/notification") {
    setNotificationCount((prev) => prev + 1);
  } else {
    markNotificationSeen();
  }

  socket?.emit("received-notification", authUser.userName);
  toast.success(notification.content || "New Notification");
}, [location.pathname, authUser, socket]);


useEffect(() => {
  if (!socket || !authUser?._id) return;

  socket.on("receive-notification", handleNotification);

  return () => {
    socket.off("receive-notification", handleNotification);
  };
}, [socket, authUser?._id, handleNotification]);  // ✅ use stable function



  const value = { 
    feedPosts, getFeedPosts, likePost, myPosts, getMyPosts,
    notifications, setNotifications, getNotifications, 
    markNotificationSeen, notificationCount, setNotificationCount, isSeen, setIsSeen, createPost
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostProvider;
