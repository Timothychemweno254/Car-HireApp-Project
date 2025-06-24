import React from 'react';
import { FaCar, FaUsers, FaMapMarkedAlt, FaAward } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Company</h1>
          <p className="text-xl max-w-2xl mx-auto">Discover our story and what makes us the preferred choice for car rentals</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="space-y-6 text-gray-700">
              <p>
                Founded in 2010, Premium Rentals began with a simple mission: to provide exceptional vehicles and 
                outstanding service to travelers. What started as a small local business with just five cars has 
                grown into a trusted name in the car rental industry.
              </p>
              <p>
                Our journey has been fueled by our passion for cars and our commitment to customer satisfaction. 
                Over the years, we've expanded our fleet to include the latest models from top manufacturers while 
                maintaining our personal touch and attention to detail.
              </p>
              <p>
                Today, we serve thousands of happy customers across multiple locations, but we still operate with 
                the same values that guided us from the beginning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaCar className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Fleet</h3>
              <p className="text-gray-600">Late-model vehicles maintained to the highest standards</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600">Dedicated to providing exceptional service to every client</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaMapMarkedAlt className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Locations</h3>
              <p className="text-gray-600">Multiple pickup points for your convenience</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaAward className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Award-Winning</h3>
              <p className="text-gray-600">Recognized for excellence in the rental industry</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Team Member" 
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">Michael Johnson</h3>
              <p className="text-blue-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600">With 15+ years in the automotive industry, Michael leads our vision.</p>
            </div>

            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Team Member" 
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">Sarah Williams</h3>
              <p className="text-blue-600 mb-2">Operations Manager</p>
              <p className="text-gray-600">Ensures every rental experience meets our high standards.</p>
            </div>

            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/75.jpg" 
                alt="Team Member" 
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">David Chen</h3>
              <p className="text-blue-600 mb-2">Customer Relations</p>
              <p className="text-gray-600">Dedicated to making every customer interaction exceptional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Premium Service?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Book your perfect vehicle today and enjoy the journey</p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;