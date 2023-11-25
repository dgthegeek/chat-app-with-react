import React from 'react';

const ChatMessage = ({ message }) => {
  const { text, uid, createdAt } = message;

  // You can format the timestamp as needed
  const formattedTimestamp = new Date(createdAt).toLocaleTimeString();

  return (
    <div className={`message ${uid === 'currentUserId' ? 'sent' : 'received'}`}>
      <p>{text}</p>
      <small>{formattedTimestamp}</small>
    </div>
  );
};

export default ChatMessage;
