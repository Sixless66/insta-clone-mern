import React from 'react'
import { LogOut } from 'lucide-react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { PostContext } from '../context/PostContext'
import { SocketContext } from '../context/SocketContext'
import { useState } from 'react'

const Logout = () => {
  
    const {  setToken, setSelectedUser } = useContext(UserContext)
    const { setSocket } = useContext(SocketContext)
    const {  setMyPosts } = useState([]);

    const handleLogout = () => {
         localStorage.removeItem('token');
         setToken('');
         setSelectedUser(null);
         setSocket(null);
         setMyPosts([])
    }

  return (
    <div className='flex items-center px-4 gap-4'>
        <p className='text-white text-lg font-semibold hidden sm:block'>Logout</p>
        <LogOut className='text-white' onClick={handleLogout}/>
    </div>
  )
}

export default Logout
