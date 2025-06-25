import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout_user();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  
  const isActive = (path) => location.pathname === path;

  
  const linkStyles = (path) => `
    px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300
    ${isActive(path) ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}
    flex items-center justify-center
  `;

  
  const mobileLinkStyles = (path) => `
    block px-3 py-2 rounded-md text-base font-medium
    ${isActive(path) ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}
  `;

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo  */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-white text-2xl font-bold tracking-tight">
                  <span className={`px-3 py-1 rounded-l-lg ${isActive('/') ? 'bg-blue-700' : 'bg-blue-700'}`}>Easy</span>
                  <span className={`px-3 py-1 rounded-r-lg ${isActive('/') ? 'bg-blue-500' : 'bg-blue-500'}`}>Hire</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation  */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              <Link to="/" className={linkStyles('/')}>
                Home
              </Link>
              <Link to="/about" className={linkStyles('/about')}>
                About
              </Link>
              <Link to="/contact" className={linkStyles('/contact')}>
                Contact
              </Link>

              {currentUser && (
                <>
                  <Link to="/cars" className={linkStyles('/cars')}>
                    Cars
                  </Link>
                  <Link to="/profile" className={linkStyles('/profile')}>
                    Profile
                  </Link>
                  {currentUser?.is_admin && (
                    <>
                      <Link to="/admin" className={linkStyles('/admin')}>
                        Admin
                      </Link>
                      <Link to="/admin/add-car" className={linkStyles('/admin/add-car')}>
                        Add Car
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop  */}
          <div className="hidden md:block ml-4 flex items-center md:ml-6 space-x-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={linkStyles('/login')}>
                  Login
                </Link>
                <Link to="/signup" className={linkStyles('/signup')}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile  */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none transition duration-150 ease-in-out"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={mobileLinkStyles('/')} onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/about" className={mobileLinkStyles('/about')} onClick={toggleMobileMenu}>
            About
          </Link>
          <Link to="/contact" className={mobileLinkStyles('/contact')} onClick={toggleMobileMenu}>
            Contact
          </Link>

          {currentUser && (
            <>
              <Link to="/cars" className={mobileLinkStyles('/cars')} onClick={toggleMobileMenu}>
                Cars
              </Link>
              <Link to="/profile" className={mobileLinkStyles('/profile')} onClick={toggleMobileMenu}>
                Profile
              </Link>
              {currentUser?.is_admin && (
                <>
                  <Link to="/admin" className={mobileLinkStyles('/admin')} onClick={toggleMobileMenu}>
                    Admin
                  </Link>
                  <Link to="/admin/add-car" className={mobileLinkStyles('/admin/add-car')} onClick={toggleMobileMenu}>
                    Add Car
                  </Link>
                </>
              )}
            </>
          )}

          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={mobileLinkStyles('/login')} onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/signup" className={mobileLinkStyles('/signup')} onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;