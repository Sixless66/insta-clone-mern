import express from 'express';
import { upload } from '../middleware/upload.js';
import { register, login } from '../controllers/authController.js';
import {
  getUserProfile,
  followUser,
  searchUser,
  editProfile,
  getFollowers,
  getMyData,
  getFollowings,
  suggestedUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication
router.post('/register', register);
router.post('/login', login);

// User profile & data
router.get('/mydata', protect, getMyData);
router.get('/profile', protect, getUserProfile);
router.get('/suggested-user', protect,  suggestedUsers)


// Followers & Following
router.get('/followers', protect, getFollowers);
router.get('/followings', protect, getFollowings);
router.post('/:userId/follow', protect, followUser);

// Search & edit profile
router.get('/search', protect, searchUser); // simplified endpoint
router.post('/edit', protect, upload.single('image'), editProfile);

export default router;
