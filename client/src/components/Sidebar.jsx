import React, { useContext } from 'react'
import { Home, User, Bell, Search, Send, SquarePlus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logout from './Logout'
import { UserContext } from '../context/UserContext'
import { PostContext } from '../context/PostContext'



const Sidebar = () => {
  const { authUser, setSelectedUser, selectedUser } = useContext(UserContext)
  const { notificationCount  } = useContext(PostContext);


  return authUser ? (
    <div
      className=' h-full [@media(max-width:550px)]:hidden'>
      <div className="h-full flex flex-col justify-between px-4 py-6 border-r border-stone-500">
        <div className="flex flex-col gap-3 text-white text-lg">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold font-serif bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
              Zeno
            </h1>
          </div>

          {/* Nav Items */}
          <NavLink to="/" onClick={() => setSelectedUser(null)} className="flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <Home /> <p className="hidden sm:block">Home</p>
          </NavLink>

          <NavLink to="/search" className="flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <Search /> <p className="hidden sm:block">Search</p>
          </NavLink>

          <NavLink to="/notification" className="relative flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <Bell /> <p className="hidden sm:block">Notifications</p>
            {
              notificationCount > 0 && <div className='absolute left-5 top-1 bg-red-500 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>{ notificationCount}</div>
            }
          </NavLink>

          <NavLink to="/message" className="flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <Send /> <p className="hidden sm:block">Message</p>
          </NavLink>

          <NavLink to={`/profile/${selectedUser ? selectedUser.userName : authUser.userName}`} className="flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <User /> <p className="hidden sm:block">Profile</p>
          </NavLink>

          <NavLink to="/create" className="flex gap-3 items-center hover:bg-gray-700 px-3 py-2 rounded-md">
            <SquarePlus /> <p className="hidden sm:block">Create</p>
          </NavLink>
        </div>

        <Logout />
      </div>
    </div>
  ) : null
}

export default Sidebar;
