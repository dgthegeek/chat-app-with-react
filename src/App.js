import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import ChatRoom from './components/chat/chat';
import SignIn from './components/Connexion/Connection'
import SignOut from './components/deconnexion/deconnection'


firebase.initializeApp({
  apiKey: "AIzaSyBVS1nDVD6KXhofv1PLOufZi8xihlua5FQ",
  authDomain: "dame-767e4.firebaseapp.com",
  projectId: "dame-767e4",
  storageBucket: "dame-767e4.appspot.com",
  messagingSenderId: "348323459667",
  appId: "1:348323459667:web:bd02fa1da8b1f24096cca6",
  measurementId: "G-LXG0Z5Q4XR"
});

const auth = firebase.auth();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Groupe Chat</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
};

export default App;
