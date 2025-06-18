import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout_user(); // removes token, clears user, etc.
    navigate('/login'); // redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-2xl">Car Rentals</h1>

      <div className="flex gap-4">
        {/* Common links for all users */}
        <Link
          to="/"
          className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
        >
          Contact
        </Link>

        {/* Links visible when NOT logged in */}
        {!currentUser && (
          <Link
            to="/signup"
            className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        )}

        {/* Links visible when logged in */}
        {currentUser && (
          <>
            <Link
              to="/cars"
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Cars
            </Link>
            <Link
              to="/profile"
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Profile
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
