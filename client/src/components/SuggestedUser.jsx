import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import assets from "../assets/assets";
import { Loader } from "lucide-react";

const SuggestedUser = () => {
  const { suggestedUsers, suggested } = useContext(UserContext);

  useEffect(() => {
    suggested();
  }, []);

  if(!suggestedUsers) return <Loader/>

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 font-semibold">Suggested for you</p>
        <button className="text-blue-500 text-sm font-medium hover:underline">
          See All
        </button>
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-3">
        {suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition"
            >
              {/* Profile Pic + Info */}
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-white">{user.userName}</p>
                </div>
              </div>

              {/* Follow Button */}
              <button className="text-blue-500 text-sm font-semibold hover:text-blue-700">
                Follow
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No user found</div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUser;
