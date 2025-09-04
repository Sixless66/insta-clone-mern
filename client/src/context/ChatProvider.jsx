import {  useContext, useEffect, useState } from "react"
import { ChatContext } from "./ChatContext"
import { toast } from 'react-hot-toast'
import axios from "axios"
import {SocketContext} from "./SocketContext"


 const backendURL = import.meta.env.VITE_BACKEND_URL
 axios.defaults.headers.common["token"] = localStorage.getItem("token");
 axios.defaults.baseURL = backendURL

export const ChatContextProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState([])
    const [usersForMessage, setUsersForMessage] = useState([]);
    const { socket } = useContext(SocketContext)
 
    // function to get all users for sidebar 
     const getMessageUsers = async () => { 
            try {
                const { data } = await axios.get('/api/message/users');
                if(data.success) {
                    setUsersForMessage((data.users))
                } 
            } catch (error) {
                toast.error(error.message)
            } 
     } 
         
    // function to get messages for selected user 
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.post(`/api/message/${userId}`);
            if(data.success) { 
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message);
        } 
    } 
  

    // function to send message to selected user
    const sendMessage = async (messageData) => {
         try {   
            const { data } = await axios.post(`/api/message/send/${chatUser._id}`, messageData)
            if(data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message);
            } 
         } catch (error) {
             toast.error(error.message)  
         } 
    } 

    //function to subscribe to message for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on('newMessage', (newMessage) => {         
            if(chatUser && newMessage.senderId === chatUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({ 
                    ...prevUnseenMessages, [newMessage.senderId] :
                    prevUnseenMessages[newMessage.senderId] ?
                     prevUnseenMessages[newMessage.senderId] + 1 : 1
                })) 
            }
        }) 
    } 

    // function to unsubscribe from messsages 
    const unsubscribeFromMessages = () => {
        if(socket) socket.off('newMessage');
    } 

    useEffect(()=> {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, chatUser]) 

    const value = {
       messages, chatUser, getMessages, sendMessage, setChatUser,
       unseenMessages, setUnseenMessages, usersForMessage, setUsersForMessage, getMessageUsers
    } 

   return (
       <ChatContext.Provider value={value}> 
           { children }
      </ChatContext.Provider>
   )
} 

