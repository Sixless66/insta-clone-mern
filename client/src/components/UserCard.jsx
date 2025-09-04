
import { User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, setSelectedUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
      setSelectedUser(user)
      navigate(`/profile/${user.userName}`)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white shadow rounded-xl hover:bg-blue-50 transition">
      {/* Profile + Info */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={handleClick}
      >
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.userName} 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
            <User className="text-gray-500" />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{user.userName}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Mail size={14} /> {user.email}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-200 transition">
        {user.isFollow ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;

