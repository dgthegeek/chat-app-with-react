import React, { useState, useEffect } from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import axios from 'axios';
import ChatRoom from './components/chat/chat';
import SignIn from './components/connexion/connection';
import Registration from './components/inscription/inscription';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/checkAuthStatus');
        console.log('res',response);
        setUser(response.data);
        console.log('userap',user);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= {user ? <ChatRoom user={user} /> : <SignIn setUser={setUser} />}/>
          <Route path="register" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
