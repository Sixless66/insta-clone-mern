import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-2 py-2 rounded-2xl shadow-md bg-[#1e1e1e] typing-wrapper">
      <span className="w-1.5 h-1.5 bg-green-600 rounded-full typing-dot"></span>
      <span className="w-1.5 h-1.5 bg-green-600 rounded-full typing-dot"></span>
      <span className="w-1.5 h-1.5 bg-green-600 rounded-full typing-dot"></span>
    </div>
  );
};


export default TypingIndicator;
