import React, { useState, useContext, useEffect } from "react";
import { Search } from "lucide-react";
import { PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const Posts = () => {
  
  const [search, setSearch] = useState("");
  const { myPosts,  getMyPosts  } = useContext(PostContext);

  useEffect(() => {
     getMyPosts()
  },[])

   if(!myPosts) return ( <Loader/> )

  return (
    <div className="h-full flex flex-col gap-5 px-10 py-5 overflow-y-scroll">
      
      {/* Search Bar */}
      <div className="flex items-center gap-2 w-[600px] mx-auto px-3 py-2 bg-blue-100 border border-gray-200 rounded-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full bg-transparent outline-none"
        />
        <Search className="text-gray-600" />
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        { myPosts.length > 0 ? (
          myPosts.map((post, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={post.postImage}
                alt={post.caption || "Post"}
                className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-semibold">
                {post.caption || "No Caption"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No posts found
          </p>
        )}
      </div>
    </div>
  );
};

export default Posts;
