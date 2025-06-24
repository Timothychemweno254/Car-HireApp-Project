import React, { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../App.css';

const Signup = () => {
  const { register_user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    register_user(username, email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create an Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              name="username"
              ref={usernameRef}
              value={formData.username}
              onChange={handleChange}
              className="auth-input"
              placeholder=" "
              required
            />
            <label htmlFor="username" className="input-label">Username</label>
          </div>
          
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              ref={emailRef}
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              placeholder=" "
              required
            />
            <label htmlFor="email" className="input-label">Email</label>
          </div>
          
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              ref={passwordRef}
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              placeholder=" "
              required
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
          
          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              ref={confirmPasswordRef}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              placeholder=" "
              required
            />
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <button 
              type="button" 
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            onClick={createRipple}
          >
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;