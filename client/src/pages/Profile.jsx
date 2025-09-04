import React, { useState, useContext, useEffect } from "react";
import { Pencil, X, UserPlus, Loader2 } from "lucide-react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const Profile = () => {
  const {
    userProfile,
    userStats,
    getUserProfile,
    selectedUser,
    navigate,
    authUser,
    updateProfile,
    followAndUnfollow
  } = useContext(UserContext);

  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isLoading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({ bio, image });
    setLoading(false);
    setEdit(false);
  };

  useEffect(() => {
    if (selectedUser) {
      getUserProfile(selectedUser._id);
    } else if (authUser) {
      getUserProfile(authUser._id);
    }
  }, [selectedUser, authUser]);

  
  const handleFollowToggle = async () => {
    
      setFollowLoading(true);
      followAndUnfollow(selectedUser._id)
      await getUserProfile(); 
      setFollowLoading(false);  
  };


  if (!userProfile) return <Loader />;

  const isOwnProfile = authUser && userProfile._id === authUser._id;

  return (
    <div className="w-full h-full flex flex-col items-center px-6 py-8 overflow-y-auto">
      {/* Cover Banner */}
      <div className="relative w-full max-w-3xl h-[140px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-xl shadow-md" />

      {/* Profile Card */}
      <div className="relative flex items-center gap-6 w-full max-w-3xl bg-white rounded-b-xl shadow-md p-6">
        {/* Profile Image */}
        <div className="absolute -top-12 left-6">
          {userProfile.profilePic ? (
            <img
              src={userProfile.profilePic}
              alt="profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          ) : (
            <p className="flex justify-center items-center w-24 h-24 text-white text-xl font-bold bg-blue-600 rounded-full border-4 border-white shadow-md">
              {userProfile.userName.charAt(0)}
            </p>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col ml:5 mt-10 ml-20 md:ml-32 overflow-hidden">
          <p className="text-lg font-semibold">{userProfile.userName}</p>
          <p className="text-gray-500 text-sm">@{userProfile.userName}</p>
        </div>

        {/* Stats */} 
        <div className="flex ml-auto gap-8">
          <div
            onClick={() => navigate("/posts")}
            className="flex flex-col items-center cursor-pointer hover:text-blue-600"
          >
            <p className="font-bold text-lg">{userStats.posts}</p>
            <p className="text-sm">Posts</p>
          </div>
          <div
            onClick={() => navigate("/followers")}
            className="flex flex-col items-center cursor-pointer hover:text-blue-600"
          >
            <p className="font-bold text-lg">{userStats.followers}</p>
            <p className="text-sm">Followers</p>
          </div>
          <div
            onClick={() => navigate("/followings")}
            className="flex flex-col items-center cursor-pointer hover:text-blue-600"
          >
            <p className="font-bold text-lg">{userStats.following}</p>
            <p className="text-sm">Following</p>
          </div>
        </div>

        {/* Right Corner Button */}
        <div className={`absolute right-4 ${isOwnProfile ? 'top-4' : 'top-3'}`}>
          {isOwnProfile ? (
            <div
              className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => setEdit(true)}
            >
              <Pencil size={20} />
            </div>
          ) : (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`px-4 py-1 rounded-md text-white shadow-md transition ${
                userStats.isFollow
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-70`}
            >
              {followLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : userStats.isFollow ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </button>
          )}
        </div> 
      </div>

      {/* Edit Modal */}
      {edit && (
        <div className="fixed inset-0 z-20 flex justify-center items-center bg-black/50">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 w-full sm:w-[360px] p-6 rounded-xl bg-white shadow-lg relative"
          >
            {/* Profile Picture Upload */}
            <label htmlFor="img" className="cursor-pointer">
              <input
                type="file"
                id="img"
                onChange={(e) => setImage(e.target.files[0])}
                hidden
              />
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-full">
                  <UserPlus className="text-gray-500" />
                </div>
              )}
            </label>

            {/* Bio Input */}
            <textarea
              placeholder="Write your bio..."
              className="w-full h-20 resize-none p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
              Save
            </button>

            {/* Close Button */}
            <X
              className="absolute top-3 right-1 sm:right-2 lg:right-4 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setEdit(false)}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
