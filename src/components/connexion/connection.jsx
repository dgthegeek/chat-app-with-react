import React, { useState } from 'react';
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
      setUser(response.data);
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

export default SignIn;
