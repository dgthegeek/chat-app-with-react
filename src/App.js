import React, { useState, useEffect } from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import ChatRoom from './components/chat/chat';
import SignIn from './components/connexion/connection';
import Registration from './components/inscription/inscription';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for an existing token in local storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      console.log("decod", decodedToken);
      setUser({ username: decodedToken.username, uid : decodedToken.uid, token: storedToken });
    }
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
