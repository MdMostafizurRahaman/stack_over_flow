import React, { useState } from 'react';
import PropTypes from 'prop-types';
import config from '../config';
import image from '../images/image.png'
function Auth({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/user/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert('Signup successful');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred during sign-up: ' + error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/user/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        
        // Store the token in localStorage after successful login
        localStorage.setItem('token', data.token);
        console.log('Token saved to localStorage:', data.token);

        alert('Sign-in successful');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Sign-in failed. Please check your credentials.');
      }
    } catch (error) {
      alert('An error occurred during sign-in: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-6">
      <div className="flex items-center space-x-2 ">
        
        <img src={image} alt="Logo" className="h-16 w-16 square-full p-1" />
        <h1 className="text-5xl font-extrabold text-white drop-shadow-md">
          Stack Overflow
        </h1>
      </div>
      <br />

        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-4 mb-5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-4 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-4 rounded-lg mb-4 transition transform hover:scale-105"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-4 rounded-lg transition transform hover:scale-105"
        >
          Sign In
        </button>
      </div>
    </div>
  );
  
  
}

Auth.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Auth;