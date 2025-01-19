import { useState } from 'react';
import PropTypes from 'prop-types';

function Auth({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const res = await fetch('http://localhost:3001/users/signUp', {
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
      const res = await fetch('http://localhost:3001/users/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">Stack Overflow</h1>
      <div className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-2 mb-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-2 mb-4 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="w-full bg-sky-500 hover:bg-blue-600 text-white py-2 rounded mb-2"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
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