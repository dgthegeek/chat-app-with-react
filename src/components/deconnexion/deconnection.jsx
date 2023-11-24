import React from 'react';
import firebase from 'firebase/app';

const SignOut = () => {
  return (
    firebase.auth().currentUser && (
      <button className="sign-out" onClick={() => firebase.auth().signOut()}>
        Deconnecter
      </button>
    )
  );
};

export default SignOut;
