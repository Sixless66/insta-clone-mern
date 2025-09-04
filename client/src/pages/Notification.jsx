import React, { useContext, useEffect } from 'react'
import assets from '../assets/assets'
import { formatDateTime } from '../utils/formatDateTime.js'
import { PostContext } from '../context/PostContext.jsx'

const Notification = () => {
  const { notifications, notificationCount, isSeen, markNotificationSeen } = useContext(PostContext)

   useEffect(() => {
       if((!isSeen || notificationCount > 0) && notifications.length > 0) {
          markNotificationSeen()
       }
   }, []) 

  return (
    <div className="flex-1 w-full h-full overflow-y-scroll px-4 py-5">
      {
      notifications && notifications.length > 0 ? (
        <ul className="flex flex-col h-full w-full lg:w-[850px]">

            <h1 className='text-white text-center mt-b-5 text-2xl'>You have a <span className='text-indigo-700'>{ notificationCount } </span> new notifications</h1>
          {
          notifications.map((notification) => (
            <li
              key={notification._id}
              className="flex  justify-between gap-3 border-b border-stone-700 px-4 py-3 hover:bg-stone-900 transition"
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                <img 
                  src={notification.sender.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium text-gray-300">
                    <span className="text-blue-400">{notification.sender.userName}</span>{' '}
                    {notification.type === 'like' && 'liked your post'}
                    {notification.type === 'comment' && 'commented on your post'}
                    {notification.type === 'follow' && 'started following you'}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(notification.createdAt)}
                  </span>
                </div>
              </div>

              {/* Post thumbnail (if any) */}
              { notification.post && (
                <img
                  src={notification.post}
                  alt="post"
                  className="w-20 rounded object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          No notifications yet
        </div>
      )}
    </div>
  )
}

export default Notification
