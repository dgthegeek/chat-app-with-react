import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatMessage = ({ message }) => {
  const { text, uid, createdAt } = message;
  const [username, setUsername] = useState('');
  const formattedTimestamp = new Date(createdAt).toLocaleTimeString();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/username/${uid}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [uid]);

  return (
    <div className={`message ${uid === 'currentUserId' ? 'sent' : 'received'}`}>
      <p>{username} : {text}    {formattedTimestamp}</p> 
    </div>
  );
};

export default ChatMessage;
