import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useDebounce } from "../hooks/useDebounce";
import { assets } from '../assets/assets.js'
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const SearchUser = () => {
  const [search, setSearch] = useState("");
  const { searchUser, getSearchUsers , setSelectedUser } = useContext(UserContext);

  const navigate = useNavigate();

  // debounced value (delay = 500ms)
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch.trim()) {
        getSearchUsers(debouncedSearch);
    } 
  }, [debouncedSearch, getSearchUsers]);


  return (
    <div className="h-full w-full px-4 py-6 sm:px-8 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4">
        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[400px] lg:w-[600px] border rounded-xl px-4 py-3 
                     outline-none border-gray-300 shadow-sm  placeholder:text-gray-100 text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     transition" />     
       {
        
       searchUser && <div className="w-full sm:w-[400px] lg:w-[600px]  rounded-xl shadow-sm p-3 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-2">
            {
             searchUser && searchUser.length > 0 
             ? searchUser.map((user) => (
              <li onClick={() => {setSelectedUser(user), navigate(`/profile/${user.userName}`)}}
                key={user._id}
                className="flex items-center gap-3 p-3 border rounded-lg 
                           hover:bg-gray-700 active:bg-gray-600  bg-[#282142]/50
                           cursor-pointer transition"
              >
                <img
                  src={user.profilePic || assets.avatar_icon }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                
                <p className="font-semibold text-white">{user.userName}</p>
                
              </li>
            )) :  <p className="text-gray-500 mt-3 text-center">No users found</p>
          }
          </ul>            
          
        </div>
    
    }
      </div>
    </div>
  );
};

export default SearchUser;
