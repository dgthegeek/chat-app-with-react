import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from '../message/message';
import { useNavigate } from 'react-router-dom';

const ChatRoom = ({ user }) => {
  
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');

  const navigate = useNavigate()

  console.log('user', user);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/messages');
        setMessages(response.data);
        dummy.current.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/sendMessage', {
        text: formValue,
        uid: user.uid,
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logOut');
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
     <header>
        <h2>Welcome, {user.username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Ecrire..."
        />
        <button type="submit" disabled={!formValue}>
          Envoyer
        </button>
      </form>
    </>
  );
};

export default ChatRoom;
