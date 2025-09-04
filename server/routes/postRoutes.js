import express from 'express';
import {  createPost, likePost, commentOnPost, deletePost, getUserPosts, getFeedPosts
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Posts
router.post('/create', protect, upload.single('image'), createPost);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/comment', protect, commentOnPost);
router.get('/feeds', protect,  getFeedPosts);
router.get('/posts', protect, getUserPosts);
router.delete('/:postId', protect, deletePost);

// Optional: fetch all likes (useful for admin or analytics)

export default router;