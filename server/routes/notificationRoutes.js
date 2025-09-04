import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { getAllNotifications, getUnseenNotifications, subscribeToNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getUnseenNotifications);
router.get('/all', protect, getAllNotifications);
router.put('/mark', protect, subscribeToNotification);


export default router 