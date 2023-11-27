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
      const { token, username } = response.data;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Set the user and token in the state
      setUser({ username, token });

      // Optionally, you can redirect the user to a different page
      // For example, you can use the 'useHistory' hook from 'react-router-dom'
      // to programmatically navigate to another page
      // history.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle authentication error, e.g., display an error message to the user
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