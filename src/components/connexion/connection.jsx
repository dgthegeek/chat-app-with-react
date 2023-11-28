import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SignIn = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/signIn', formData);
      const { token, username, uid } = response.data;
      // Store the token in local storage
      localStorage.setItem('token', token);
      // Set the user and token in the state
      setUser({ username, token, uid });
    } catch (error) {
      console.error('Bad credentials');
      alert("Username or password incorect!")
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn