import express from 'express';
import { getMessages, getUserForMessage, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const messageRouter = express.Router();

messageRouter.get('/users', protect, getUserForMessage);
messageRouter.post('/:id', protect, getMessages);
messageRouter.put('/mark/:id', protect, markMessageAsSeen);
messageRouter.post('/send/:id', protect, sendMessage)

export default messageRouter;

