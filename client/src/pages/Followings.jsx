import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import EmptyState from "../UI/EmptyState";

const Followings = () => {
  const { followings, getFollowings, setSelectedUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getFollowings();
  }, []);

  if (followings === null) return <Loader />;

  return (
    <div className="h-full p-4 max-w-3xl mx-auto overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Followings</h2>

      {followings.length > 0 ? (
        <div className="space-y-4">
          {followings.map((user) => (
            <div
              key={user._id}
              className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 border rounded-xl shadow-md hover:shadow-lg transition bg-white"
            >
              {/* Left: Profile */}
              <div
                className="flex items-center gap-4 cursor-pointer w-full sm:w-auto"
                onClick={() => {
                  setSelectedUser(user);
                  navigate(`/profile/${user.userName}`);
                }}
              >
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt={user.userName}
                  className="w-16 h-16 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg">{user.userName}</h3>
                  <p className="text-sm text-gray-500">@{user.userName}</p>
                  {user.bio && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Button */}
              <div className="mt-3 sm:mt-0 sm:ml-auto flex-shrink-0">
                {user.isFollow ? (
                  <button className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                    Following
                  </button>
                ) : (
                  <button className="px-4 py-1 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition">
                    Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState label="followings" />
      )}
    </div>
  );
};

export default Followings;
