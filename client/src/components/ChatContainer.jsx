import React, { useContext, useEffect, useState, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { UserContext } from '../context/UserContext';
import assets from '../assets/assets';
import { formatMessageTime } from '../utils/formatMessageTime';
import { toast } from 'react-hot-toast';
import { SocketContext } from '../context/SocketContext';
import TypingIndicator from './TypingIndicator';

const ChatContainer = () => {
  const { chatUser, messages, setChatUser, sendMessage, getMessageUsers, usersForMessage } = useContext(ChatContext);
  const { authUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [typing, setTyping] = useState(null);

  const scrollEnd = useRef();
  const [input, setInput] = useState('');
  const typingTimeout = useRef(null); // 🟢 for stop typing

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
    socket.emit('stop-typing', chatUser._id); // 🟢 hide indicator after sending
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error('Select an image file');
    await sendMessage({ image: file });
    e.target.value = '';
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);

    // emit typing
    socket.emit('type-indicator', chatUser._id);

    // clear old timeout
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // 🟢 after 2s inactivity => stop typing
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop-typing', chatUser._id);
    }, 2000);

    // if input cleared instantly
    if (value.trim() === '') {
      socket.emit('stop-typing', chatUser._id);
    }
  };

  useEffect(() => {
    if (scrollEnd.current && messages?.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (usersForMessage.length < 1) {
      getMessageUsers();
    }

    socket?.on('type-indicator', (senderId) => {
      setTyping(senderId);
    });

    socket?.on('stop-typing', (senderId) => {
      if (typing === senderId) {
        setTyping(null);
      }
    }); 

    return () => {
      socket?.off('type-indicator');
      socket?.off('stop-typing');
    };
  }, [socket, typing]);

  return (
    <div className={`flex-1 h-full ${chatUser ? 'block' : 'hidden'} lg:block relative bg-[#0d0d0d]`}>
      {/* --- Header --- */}
      {chatUser ? (
        <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-700 bg-[#1a1a1a]">
          <img
            src={chatUser.profilePic || assets.avatar_icon}
            alt=""
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <p className="flex-1 text-lg text-white">{chatUser.userName || 'Unknown User'}</p>
          <img
            onClick={() => setChatUser(null)}
            src={assets.arrow_icon}
            alt=""
            className="lg:hidden w-6 cursor-pointer"
          />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a chat to start messaging
        </div>
      )}

      {/* --- Chat Messages --- */}
      {chatUser && (
        <div className="flex flex-col h-[calc(100%_-_120px)] overflow-y-auto px-4 pt-3 py-10 space-y-2">
          {messages?.length > 0 ? (
            messages.map((msg, index) => {
              const isSender = msg.senderId === authUser?._id;
              return (
                <div
                  key={index}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      isSender
                        ? 'bg-[#005c4b] text-white rounded-br-none'
                        : 'bg-[#1e1e1e] text-white rounded-bl-none'
                    }`}
                  >
                    {msg.image ? (
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={msg.image}
                          alt="sent-img"
                          className="max-w-[230px] rounded-md mb-1"
                        />
                      </div>
                    ) : (
                      <p className="text-sm mb-1">{msg.text}</p>
                    )}
                    <p className="text-[11px] text-gray-400 text-right">
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-400 text-sm mt-4">No messages yet</p>
          )}

          {/* 🟢 Typing bubble */}
          {typing === chatUser._id && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}

          <div ref={scrollEnd}></div>
        </div>
      )} 

      {/* --- Input Area --- */}
      {chatUser && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 py-3 bg-[#1a1a1a]">
          <div className="flex-1 flex items-center bg-[#2c2c2c] px-4 py-2 rounded-full">
            <input
              onChange={handleInput}
              value={input}
              type="text"
              placeholder="Type a message"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              className="flex-1 text-sm bg-transparent outline-none text-white placeholder-gray-400"
            />
            <input
              onChange={handleSendImage}
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              hidden
            />
            <label htmlFor="image" className="cursor-pointer">
              <img src={assets.gallery_icon} alt="gallery" className="w-5 ml-3" />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt="send"
            className="w-7 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
