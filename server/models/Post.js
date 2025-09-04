import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postImage: { type: String, required : true },
  caption: { type: String, required: true },
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);