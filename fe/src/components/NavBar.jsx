import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import image from '../images/image.png';
function NavBar({ onLogout }) {
  return (
    <nav className="bg-blue-500 p-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <img src={image} alt="Logo" className="h-8 mr-2 inline-block" />
          Stack Overflow
        </div>

        {/* Nav Links */}
        <div className="flex space-x-4">
          <Link to="/posts" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md"><b>Posts</b></Link>
          <Link to="/notifications" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md"><b>Notifications</b></Link>
          <Link to="/" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md"><b>Home</b></Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default NavBar;
