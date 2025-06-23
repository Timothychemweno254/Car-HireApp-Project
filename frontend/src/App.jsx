import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CarDetails from './pages/CarDetails'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import AddCar from './pages/AddCar';

import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext'; // ✅ NEW

const App = () => {
  return (
    <UserProvider>
      <AdminProvider>
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
            <Route path="/admin/add-car" element={<AddCar />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
            progressStyle={{
              background: 'rgba(255, 255, 255, 0.3)',
            }}
            bodyClassName="font-sans"
          />
        </div>
      </AdminProvider>
    </UserProvider>
  );
};

export default App;
