import React from 'react';
import firebase from 'firebase/app';

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>Utilise Google pour te connecter</p>
    </>
  );
  
};

export default SignIn;
