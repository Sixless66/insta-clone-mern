import React, { useContext, useEffect } from "react";
import SuggestedUser from "../components/SuggestedUser";
import { Heart, MoreHorizontal, MessageCircle, Bookmark, Send } from "lucide-react";
import { PostContext } from "../context/PostContext";
import { formatDateTime } from "../utils/formatDateTime.js";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

const Feed = () => {
  const { feedPosts, likePost, getFeedPosts  } = useContext(PostContext);
  const { setSelectedUser,  } = useContext(UserContext);

  const handleLike = async (postId) => {
    if (!postId) return;
    await likePost(postId);
  };
  
  useEffect(() => {
       getFeedPosts()
  }, [likePost])

   if(!feedPosts) return <Loader/>

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col items-center overflow-y-auto sm:px-6 sm:py-4 backdrop-blur-2xl text-white">
        {
        feedPosts.map((post, index) => (
          <div
            key={index}
            className="w-full sm:w-[400px] md:w-[500px] bg-[#818582]/10 sm:rounded-md shadow-sm mb-8"
          >
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center gap-3" onClick={() => setSelectedUser(post.author)}>
                {post.author?.profilePic ? (
                  <img
                    src={post.author.profilePic}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <p className="flex justify-center items-center text-white bg-amber-600 uppercase w-12 h-12 rounded-full">
                    {post.author?.userName?.charAt(0)}
                  </p>
                )}
                <p className="font-semibold text-sm">{post.author?.userName}</p>
              </div>
              <button>
                <MoreHorizontal className="text-gray-600" size={20} />
              </button>
            </div>

            { post.postImage && (
              <div className="w-full">
                <img
                  src={post.postImage}
                  alt="post"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex gap-4">
                <Heart
                  className="cursor-pointer hover:scale-110 transition"
                  color={post.likes?.likedByMe ? "red" : "black"}
                  fill={post.likes?.likedByMe ? "red" : "none"}
                  onClick={() => handleLike(post._id)}
                />
                <MessageCircle className="cursor-pointer hover:scale-110 transition" />
                <Send className="cursor-pointer hover:scale-110 transition" />
              </div>
              <Bookmark className="cursor-pointer hover:scale-110 transition" />
            </div>

            <div className="px-4 pb-3 text-sm">
              <p className="font-semibold">{post.likes?.count || 0} likes</p>
              <p>
                <span className="font-semibold mr-2">{post.author?.userName}</span>
                {post.caption}
              </p>
              <p className="text-gray-100 text-xs mt-1">
                {formatDateTime(post.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block w-[300px] bg-[#818582]/10 border-l border-gray-200 p-4 overflow-y-auto">
        <SuggestedUser />
      </div>
    </div>
  );
};

export default Feed;