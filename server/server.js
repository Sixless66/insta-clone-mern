import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cors from 'cors'
import connectDB from './lib/db.js';
import { Server } from 'socket.io';
import { createServer } from 'http'
import messageRouter from './routes/messageRoutes.js';
import notificationRouter from './routes/notificationRoutes.js'

config()
connectDB();

const app = express(); 

app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true}));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRouter)
app.use('/api/notification', notificationRouter)

const server = createServer(app);

export const io = new Server(server, {
  cors: { origins: '*' }
}); 

export const userSocketMap = {}; // { userId : socketId }

// Socket.io connection handler
io.on('connection', (socket) => {
     const {userId} = socket.handshake.query;
     const {name} = socket.handshake.query;
     console.log(`${ name } connected with id ${userId}`);

     if(userId) {
          userSocketMap[userId] = {};
          userSocketMap[userId]['socketId'] = socket.id;
          userSocketMap[userId]['name'] = name;
     } 

     // Emit online users to all connected clients
     io.emit('getOnlineUsers', Object.keys(userSocketMap));

     socket.on('type-indicator', (receiverId) => {
    if (userSocketMap[receiverId]) {
    io.to(userSocketMap[receiverId]['socketId'])
      .emit('type-indicator', userId);   // <- ab userId bhejenge 
  }
});

     // stop typing
socket.on('stop-typing', (receiverId) => {
  if (userSocketMap[receiverId]) {
    io.to(userSocketMap[receiverId]['socketId']).emit('stop-typing', userId);
  }
});


     socket.on("disconnect", () => {
        console.log(`userSocketMap[userId]['name'] disconnected`)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
     })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
     console.log("Server is listening on PORT : 5000");
})
 







