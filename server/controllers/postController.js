import { Post } from '../models/Post.js';
import { Like } from '../models/Like.js';
import { Comment } from '../models/Comment.js';
import Notification from '../models/Notification.js';  // 🔹 Add Notification Model
import cloudinary from '../config/cloudinary.js';
import sharp from 'sharp';
import { userSocketMap } from '../server.js';
import { io } from '../server.js';

/* ----------------- Create Post ----------------- */
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.user?._id) return res.json({ success: false, message: "User not authenticated" });
    if (!caption || !req.file) return res.json({ success: false, message: "Both caption & image are required" });

    const optimizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
    const uploadResult = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      author: req.user._id,
      caption,
      postImage: uploadResult.secure_url,
    });

    res.json({ success: true, message: "Post Created", post });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------- Like Post ----------------- */
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({path : "author", select : "_id userName"}).populate('postImage');
    if (!post) return res.json({ success: false, message: "Post not found" });

    if (post.author._id.toString() === req.user._id.toString()) {
      return res.json({ success: false, message: "You cannot like/unlike your own post" });
    }

    const existing = await Like.findOne({ user: req.user._id, post: postId });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      return res.json({ success: true, message: "Post Unliked Successfully" });
    } 
    
    await Like.create({ user: req.user._id, post: postId });

     
       
     const notification = await Notification.create({
      sender: req.user._id, 
      receiver: post.author._id,
      type: "like",
      post: post.postImage,
      content: 'liked your post',
      isRead : false
    });
    
        if(userSocketMap[post.author._id]) {
        const name  = userSocketMap[post.author._id]['name'];  
        const receiverSocketId  = userSocketMap[post.author._id]['socketId']
        io.to(receiverSocketId).emit('receive-notification', {  sender : { _id : req.user._id, userName : name,  profilePic : post.postImage }, type : 'like', post : post.postImage , content : 'liked your post', isRead : false, createdAt : notification.createdAt });

     }

     

    res.json({ success: true, message: "Post Liked Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------- Comment on Post ----------------- */
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId).populate("author", "_id userName");
    if (!post) return res.json({ success: false, message: "Post not found" });

    const comment = await Comment.create({ user: req.user._id, post: postId, content });

    // 🔹 Create Notification
    if (post.author._id.toString() !== req.user._id.toString()) {
        sendNotification({
        sender: req.user._id,
        receiver: post.author._id,
        type: "comment",
        post: post._id,
        content: `${req.user.userName} commented: "${content}"`,
      });
    }

    res.json({ success: true, message: 'Commented', comment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------- Feed Posts ----------------- */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "userName profilePic")
      .sort({ createdAt: -1 });

    const response = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({ post: post._id });
        const likedByMe = await Like.exists({ post: post._id, user: req.user._id });

        return {
          ...post.toObject(),
          likes: {
            count: likeCount,
            likedByMe: !!likedByMe
          }
        };
      })
    );

    res.json({ success: true, message: "Posts fetched successfully", posts: response });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

/* ----------------- Get User Posts ----------------- */
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.query.id;
    const posts = await Post.find({ author: userId })
      .populate('author', 'userName profilePic')
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Posts fetched', posts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------- Delete Post ----------------- */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.deleteOne({ _id: postId, author: req.user._id });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ----------------- Get My Posts ----------------- */
export const getMyPosts = async (req, res) => {
  try {
    const id = req.user._id;
    const posts = await Post.find({ author: id });
    res.json({ success: true, message: 'Your Post has been Fetched', posts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
