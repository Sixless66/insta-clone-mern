import React from 'react'
import ChatUsers from '../components/ChatUsers'
import ChatContainer from '../components/ChatContainer'

const Message = () => {
  return (
    <div className="h-full w-full flex">
      <ChatUsers/>
      <ChatContainer/>
    </div>
  )
} 

export default Message

