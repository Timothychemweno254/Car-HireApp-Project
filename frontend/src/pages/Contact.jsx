import React from 'react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

const Contact = () => {
  const phoneNumber = '2541766236';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const emailAddress = 'tchemweno18@gmail.com';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Contact Us
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            We'd love to hear from you! Reach out through any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message here..."
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Other ways to reach us</h3>
            
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mb-6 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 shadow-md"
            >
              <FaWhatsapp className="mr-2 text-xl" />
              Message us  on WhatsApp
            </a>

            
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <FaPhone className="text-blue-600 text-xl mt-1 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">+254 1766 236</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <FaEnvelope className="text-blue-600 text-xl mt-1 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">{emailAddress}</p>
                </div>
              </div>
            </div>

            
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-3">Follow us on social media</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="#"
                  className="bg-sky-400 hover:bg-sky-500 text-white p-3 rounded-full transition duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="#"
                  className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href="#"
                  className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;