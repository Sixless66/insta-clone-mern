// context/SocketProvider.jsx
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./UserContext";
import { SocketContext } from "./SocketContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SocketProvider = ({ children }) => {
  const { authUser } = useContext(UserContext);   // ✅ get logged in user
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!authUser) return; // wait until user is fetched

    // ✅ create new socket instance with user info
    const newSocket = io(backendUrl, {
      query: {
        userId: authUser._id,
        name: authUser.userName,
      },
      transports: ["websocket"], // force WebSocket (avoid polling issues)
      withCredentials: true,
    });

    // ✅ set socket to state
    setSocket(newSocket);

    // ✅ listen for online users
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    // ✅ cleanup on unmount or logout
    return () => {
      newSocket.disconnect();
    };
  }, [authUser]); // reconnect when authUser changes (login/logout)

  return (
    <SocketContext.Provider value={{ socket, setSocket, onlineUsers, setOnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
