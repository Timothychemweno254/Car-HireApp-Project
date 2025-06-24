import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login_user } = useContext(UserContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    login_user(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder=" "
              required
              autoComplete="username"
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>
          
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label htmlFor="password" className="input-label">Password</label>
            <button 
              type="button" 
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="auth-options">
            <Link to="/forgot-password" className="auth-link forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            onClick={createRipple}
          >
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;