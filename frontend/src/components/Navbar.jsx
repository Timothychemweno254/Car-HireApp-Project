import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout_user();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="font-bold text-2xl">Car Rentals</h1>

      <div className="flex gap-4 items-center">
        {/* Common links */}
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

        {!currentUser && (
          <Link
            to="/signup"
            className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        )}

        {/* User Links */}
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

            {/* Admin-only Links */}
            {currentUser?.is_admin && (
              <>
                <Link
                  to="/admin"
                  className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-600 transition"
                >
                  Admin
                </Link>
                <Link 
                   to="/admin/add-car"
                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                    Add New Car
                </Link>
                
               
              </>
            )}

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
