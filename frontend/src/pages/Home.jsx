import React, { useState, useEffect, useRef } from 'react';
import { FaCar, FaShieldAlt, FaMapMarkerAlt, FaPhone, FaStar, FaChevronLeft, FaChevronRight, FaSearch, FaCalendarAlt, FaCarAlt } from 'react-icons/fa';
import { motion, useAnimation, useInView } from 'framer-motion';
import { fadeIn, staggerContainer, zoomIn } from '../utils/motion';

const Home = () => {
  
  const carImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Toyota RAV4'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'BMW X5'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Mercedes C-Class'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Range Rover Sport'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Honda Civic'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Porsche 911'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Ford Mustang'
    }
  ];

  
  const testimonials = [
    {
      id: 1,
      name: 'Anonimous',
      comment: 'Best car rental experience ever! The process was seamless and the car was in perfect condition.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Michael ',
      comment: 'Great prices and excellent customer service. Will definitely use again for my next trip.',
      rating: 4,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Emily ',
      comment: 'The premium selection exceeded my expectations. Highly recommend this service!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];

  
  const duplicatedCarImages = [...carImages, ...carImages, ...carImages];
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const speed = 0.5;

  useEffect(() => {
    const carousel = carouselRef.current;
    const totalWidth = carousel.scrollWidth;
    const singleLoopWidth = totalWidth / 3;

    const animate = () => {
      setCurrentSlide(prev => {
        const newSlide = prev + speed;
        if (newSlide * speed >= singleLoopWidth) {
          carousel.style.transition = 'none';
          carousel.style.transform = `translateX(0)`;
          void carousel.offsetWidth;
          return 0;
        }
        carousel.style.transition = 'transform 0.05s linear';
        carousel.style.transform = `translateX(-${newSlide}px)`;
        return newSlide;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div className="bg-gray-50">
     
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-32"
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Premium Car Rentals Made Simple
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Discover the perfect vehicle for your journey at unbeatable prices with our premium rental service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a 
              href="cars" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Browse Our Fleet
            </a>
            <a 
              href="contact" 
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </motion.section>

      
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-gray-100 overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Luxury Fleet
          </motion.h2>
          <div className="relative">
            <div 
              ref={carouselRef}
              className="flex"
              style={{ width: 'fit-content' }}
            >
              {duplicatedCarImages.map((car, index) => (
                <motion.div 
                  key={`${car.id}-${index}`} 
                  className="px-4"
                  style={{ flex: '0 0 auto', width: '350px' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img 
                    src={car.image} 
                    alt={car.alt} 
                    className="w-full h-56 object-cover rounded-xl shadow-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

     
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn('right', 'tween', 0.2, 1)}
              className="text-center p-8 rounded-xl hover:shadow-xl transition duration-300 bg-gradient-to-b from-white to-blue-50 border border-blue-100"
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaCar className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from our extensive fleet of premium vehicles to suit every need and budget.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeIn('up', 'tween', 0.4, 1)}
              className="text-center p-8 rounded-xl hover:shadow-xl transition duration-300 bg-gradient-to-b from-white to-blue-50 border border-blue-100"
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaShieldAlt className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fully Insured</h3>
              <p className="text-gray-600">
                All our rentals come with comprehensive insurance for your peace of mind.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeIn('left', 'tween', 0.6, 1)}
              className="text-center p-8 rounded-xl hover:shadow-xl transition duration-300 bg-gradient-to-b from-white to-blue-50 border border-blue-100"
              whileHover={{ y: -10 }}
            >
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaMapMarkerAlt className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Nationwide Coverage</h3>
              <p className="text-gray-600">
                Pick up and drop off at multiple convenient locations across the country.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-3xl font-bold text-center mb-12"
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={fadeIn('up', 'tween', index * 0.2 + 0.4, 1)}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Vehicles</p>
            </motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-4xl font-bold mb-2">10K+</h3>
              <p className="text-blue-100">Happy Customers</p>
            </motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-blue-100">Locations</p>
            </motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Support</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      
      <motion.section 
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Ready for Your Next Adventure?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Contact us today to book your perfect vehicle or ask any questions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a 
              href="tel:+2541766236" 
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              <FaPhone className="mr-2" /> Call Us Now
            </a>
            <a 
              href="/contact" 
              className="flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Contact Form
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;