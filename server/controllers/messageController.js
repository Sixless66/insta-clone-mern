import Message from '../models/Message.js';
import cloudinary from '../config/cloudinary.js';
import { io, userSocketMap } from '../server.js'
import { Follow } from '../models/Follow.js';


export const getUserForMessage = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Messages se last interacted users
    let messages = await Message.find({
      $or: [{ senderId: userId }, { recieverId: userId }]
    })
      .sort({ createdAt: -1 })
      .limit(50) // taaki unique users milen
      .populate({ path: 'senderId', select: 'userName profilePic' })
      .populate({ path: 'recieverId', select: 'userName profilePic' });

    let usersFromMessages = [];

    messages.forEach(msg => { 
      // Null-safe check
      if (!msg.senderId && !msg.recieverId) return;

      const otherUser = msg.senderId._id.toString() === userId.toString() ? msg.recieverId : msg.senderId;

      // only push if otherUser exists and not already in array
      if (otherUser && !usersFromMessages.some(u => u._id.toString() === otherUser._id.toString())) {
        usersFromMessages.push(otherUser);
      } 
    });

    // 2️⃣ Agar messages se koi user na mile to followings se fetch karo
    if (usersFromMessages.length === 0) {
      const followings = await Follow.find({ follower: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({ path: 'following', select: 'userName profilePic' });

      usersFromMessages = followings
        .map(f => f.following)
        .filter(u => u); // null-safe
    } 

    res.json({
      success: true,
      message: 'Users fetched for messaging',
      users: usersFromMessages
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error' });
  }
};

//  Get all messages between two users
export const getMessages = async (req, res) => {
    try { 
        const { id : selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: selectedUserId },        
                { senderId: selectedUserId, recieverId: myId }
            ]
        })
        await Message.updateMany(
            { senderId: selectedUserId, recieverId: myId },
             { seen: true });

        res.json({ success: true, messages });     
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
} 

// Api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Message.findByIdAndUpdate(id, {seen : true});
        req.json({ success : true })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    } 
} 

// Send messae to selected user
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId, recieverId, text, image : imageUrl
        }) 

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[recieverId]['socketId'];
       
        if(receiverSocketId) {
            console.log("message event sent ")
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

       res.json({ success : true, newMessage });
    } catch (error) {
        res.json({ success : false, message : error.message });
    }
} 

