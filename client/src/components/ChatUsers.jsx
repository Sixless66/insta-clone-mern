import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext'
import assets from '../assets/assets';
import { SocketContext } from '../context/SocketContext';
import { UserContext } from '../context/UserContext';

const ChatUsers = () => {

    const { usersForMessage, chatUser, setChatUser, setUsersForMessage, getMessageUsers, getMessages, unseenMessages } = useContext(ChatContext);
    const { onlineUsers } = useContext(SocketContext)
    const { axios } = useContext(UserContext)
   
    const handleChatUser = async (user) => {
        if(!chatUser) {
           setChatUser(user); getMessages(user._id); return;
         }

         if(user._id === chatUser._id) {
            setChatUser(null); return;
         }

         setChatUser(user);
        if(unseenMessages[user._id]) {
          axios.put(`/api/messages/mark/${chatUser._id}`);
          delete unseenMessages[user._id];
        }
       
    } 

    const applySearchFilter = (e) => {
        if(!e.target.value.trim()) return;
        let usersCopy = usersForMessage.slice();
        usersCopy = usersCopy.filter((user) => ( user.userName.includes(e.target.value)))
        if(usersCopy.length > 0) {
            setUsersForMessage(usersCopy)
        }
    } 


    useEffect(() => {
         if(usersForMessage.length < 1) {
            getMessageUsers();
         }    
    },[onlineUsers])


  return (
    <div className={`flex flex-col gap-3 px-3 md:px-5 py-10 w-full overflow-auto ${ chatUser && 'hidden' } lg:w-[400px] border-r lg:block border-stone-500`}>
         <div>        
                <input type="text" placeholder='search user' onChange={(e) => applySearchFilter(e)}
                className='w-full px-4 py-2 rounded-md border border-gray-400 ouline-none placeholder:text-white text-white'/>
         </div>

         {
           usersForMessage &&  usersForMessage.length > 0 ? (
               <div className='w-full flex flex-col gap-1 mt-2'>
                    {
                        usersForMessage.map((user) => (
                            <div key={user._id} className='relative flex items-center gap-2  bg-[#282142]/50 px-2 py-0.5 rounded-lg' onClick={() => handleChatUser(user)}>
                                 <img src={ user.profilePic || assets.avatar_icon } alt="" className='w-12 h-12 rounded-full object-cover border-2 border-white'/>
                                <div className='flex flex-col'>
                                   <p className='text-white'>{user.userName}</p>
                                   { onlineUsers.includes(user._id) ? <p className='text-xs text-green-500'>online</p>
                                     : <p className='text-xs text-gray-300'>offline</p>
                                   } 
                                </div> 
                                   {unseenMessages[user._id] > 0 && (
  <p className="absolute top-1/2 right-3 -translate-y-1/2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
    {unseenMessages[user._id]}
  </p>
)}

                            </div>
                        ))
                    }
               </div>  
            ) : <div className='text-gray-200'>No user found</div>
         } 
    </div> 
  )
}

export default ChatUsers 
