import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function NavBar({ onLogout }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/posts" className="text-white px-4">Posts</Link>
          <Link to="/notifications" className="text-white px-4">Notifications</Link>
        </div>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default NavBar;
