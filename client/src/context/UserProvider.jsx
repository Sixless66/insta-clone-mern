import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "./SocketContext";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null); // replace initial value to {}
  const [selectedUser, setSelectedUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState(null); // replace initial value to []

  
  const checkAuth = async () => {    
    try { 
      const { data } = await axios.get("/api/user/mydata");
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    } 
  };

  const login = async (state, userData) => {    
    try {
      const { data } = await axios.post(`/api/user/${state}`, userData);
      if (data.success) {
        setAuthUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        toast.success(data.message);
        navigate("/"); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const updateProfile = async ({ bio, image }) => {
    try {
      let formData = new FormData();
      formData.append("bio", bio);
      if (image) formData.append("image", image);
      const { data } = await axios.post(`/api/user/edit`, formData);
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } 
  };

  const getUserProfile = async () => {
    const id = selectedUser ? selectedUser._id : authUser?._id; 
    try {
      const { data } = await axios.get(`/api/user/profile?id=${id}`);
      if (data.success) {
        setUserProfile(data.user);
        setUserStats(data.stats);
      }
    } catch (error) {
      toast.error(error.message);
    } 
  };

  const getFollowers = async () => {
    const id = selectedUser ? selectedUser._id : authUser?._id;
    try {
      const { data } = await axios.get(`/api/user/followers?id=${id}`);
      if (data.success) {
        setFollowers(data.followers);
      }     
    } catch (error) {
      toast.error(error.message);
    } 
  };

  const getFollowings = async () => {  
    const id = selectedUser ? selectedUser._id : authUser?._id;
    try {
      const { data } = await axios.get(`/api/user/followings?id=${id}`);
      if (data.success) setFollowings(data.followings);
    } catch (error) {
      toast.error( error.message);
    } 
  };

   const suggested = async () => {
    try {
      const { data } = await axios.get("/api/user/suggested-user");
      if (data.success) {
        setSuggestedUsers(data.users);   // 🔥 yahi missing tha
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const followAndUnfollow = async (to) => {
    try {
      const { data } = await axios.post(`/api/user/${to}/follow`);
      if (data.success) {
        getUserProfile();
      }
    } catch (error) {
      toast.error(error.message);
    } 
  };

  const getSearchUsers = async (username) => {
     try {
           const { data } = await axios.get(`/api/user/search?username=${username}`)
           setSearchUser(data.users);
     } catch (error) {
         toast.error(error.message)
     }
  } 

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
     checkAuth();
  }, []);


  const value = {
    axios, token, login, authUser, navigate, setToken, updateProfile, getUserProfile, userProfile, userStats, selectedUser,setSelectedUser,
    followers, followings, getFollowers, getFollowings, searchUser, getSearchUsers, followAndUnfollow, suggested, suggestedUsers
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider; 