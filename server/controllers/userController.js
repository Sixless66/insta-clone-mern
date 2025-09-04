import { User } from '../models/User.js';
import { Follow } from '../models/Follow.js';
import { Post } from '../models/Post.js';
import sharp from 'sharp'
import Notification from '../models/Notification.js';
import { io, userSocketMap } from '../server.js';


/* ------------------- USERS ------------------- */

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.id; // user we are visiting
    const loggedInUserId = req.user._id; // current logged in user

    // basic user info
    const user = await User.findById(userId)
      .select("userName profilePic bio")
      .lean();

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // stats
    const followers = await Follow.countDocuments({ following: userId });
    const following = await Follow.countDocuments({ follower: userId });
    const posts = await Post.countDocuments({ author: userId });

    // check if loggedInUser follows this user
    let isFollow = false;
    if (String(userId) !== String(loggedInUserId)) {
      isFollow = await Follow.exists({
        follower: loggedInUserId,
        following: userId,
      });
    }

    res.json({
      success: true,
      user,
      stats: {
        followers,
        following,
        posts,
        isFollow: !!isFollow,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(req.user._id) === String(userId)) {
      return res.json({ success: false, message: "You can't follow yourself" });
    }

    const alreadyFollowed = await Follow.findOne({
      follower: req.user._id,
      following: userId,
    });

    if (alreadyFollowed) {
      await Follow.deleteOne({ _id: alreadyFollowed._id });
      return res.json({ success: true, message: "Unfollowed" });
    }

    await Follow.create({ follower: req.user._id, following: userId });

    const notification = await Notification.create({
      sender: req.user._id,
      receiver: userId,
      type: "follow", 
      content: "started following you",
      isRead : false
    })

    if(userSocketMap[userId]) {
       const name = userSocketMap[userId]['name'];
       const receiverSocketId = userSocketMap[userId]['socketId']
       io.to(receiverSocketId).emit('receive-notification', { sender : { _id : req.user._id, userName : name }, content : 'started following you', type : 'follow', isRead : false, createdAt : notification.createdAt });
    }

    res.json({ success: true, message: "Followed", notification });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({ userName: { $regex: username, $options: 'i' } }).select('userName profilePic ');

    if(users.length < 1) {
       res.json({ success : false, message : 'User Not found', users : []})
    }
    res.json({ success: true, message : 'Users Founds', users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const file = req.file;

    console.log("Level 1", req.file);

    let profilePic;
    if (file) {
       console.log("Level 2");
      const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();
      console.log("Level 3");
      const fileUri = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
      const uploadResult = await cloudinary.uploader.upload(fileUri);
      console.log("final");
      profilePic = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { bio, ...(profilePic && { profilePic }) }, { new: true });
    res.json({ success: true, message: 'Profile Updated', user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const followers = await Follow.countDocuments({ following: req.user._id });
    const followings = await Follow.countDocuments({ follower: req.user._id });
    const posts = await Post.countDocuments({ author: req.user._id });

    res.json({ success: true, message: 'User data fetched', user, stats: { followers, followings, posts } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all users that the current user is following
export const getFollowings = async (req, res) => {
  try {
    const userId = req.query.id;

    // Find all follow documents where 'follow' is the userId
    const followDocs = await Follow.find({ follower : userId })
      .populate({
        path: "following", // populate the 'following' user
        select: "userName email profilePic",
      });

    const followingsWithStatus = await Promise.all(
      followDocs.map(async (doc) => {
        const followingUser = doc.following;

        const isFollow = await Follow.exists({
          follower: req.user._id,
          following: followingUser._id,
        });

        return {
          ...followingUser.toObject(),
          isFollow: !!isFollow,
        };
      })
    );

    res.json({
      success: true,
      message: "Followings fetched successfully",
      followings: followingsWithStatus,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all users who are following the current user
export const getFollowers = async (req, res) => {
  try {
    const userId = req.query.id;

    // Find all follow documents where 'following' is the userId
    const followDocs = await Follow.find({ following: userId })
      .populate({
        path: "follower", // populate the 'follow' user
        select: "userName email profilePic",
      });

    const followersWithStatus = await Promise.all(
      followDocs.map(async (doc) => {
        const followerUser = doc.follower;

        const isFollow = await Follow.exists({
          follower: req.user._id,
          following: followerUser._id,
        });

        return {
          ...followerUser.toObject(),
          isFollow: !!isFollow,
        };
      })
    );

    res.json({
      success: true,
      message: "Followers fetched successfully",
      followers: followersWithStatus,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




export const suggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id; // ensure user exists
    
    if (!currentUserId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // 1. Find all users the current user is following
    const followingDocs = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = followingDocs.map(doc => doc.following.toString());

    // 2. Exclude current user + already followed users
    const users = await User.find({
      _id: { $nin: [currentUserId, ...followingIds] }
    })
      .select("userName profilePic") // only required fields
      .limit(10); // limit results like Instagram

    res.json({
      success: true,
      message: "Suggested Users Fetched",
      users,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
