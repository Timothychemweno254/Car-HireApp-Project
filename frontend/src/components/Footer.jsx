// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center p-4 mt-auto shadow-inner">
      <p className="text-sm">&copy; {new Date().getFullYear()} Car Rentals. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
