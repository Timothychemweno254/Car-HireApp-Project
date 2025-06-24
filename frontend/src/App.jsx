// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CarDetails from './pages/CarDetails'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the new Footer component
import AdminDashboard from './pages/AdminDashboard';
import AddCar from './pages/AddCar';

import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';

// Add icons to the library
library.add(faFacebook, faTwitter, faInstagram, faLinkedin);

const App = () => {
  return (
    <UserProvider>
      <AdminProvider>
        <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
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
          </main>

          <Footer /> {/* Add the Footer component here */}

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