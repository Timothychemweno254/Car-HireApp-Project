import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { UserProvider } from './context/UserContext'; // Make sure this path is correct

const App = () => {
  return (
    <UserProvider>
      <div className="font-sans bg-gray-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
