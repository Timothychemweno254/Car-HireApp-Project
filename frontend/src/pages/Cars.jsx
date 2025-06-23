
import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';
import { UserContext } from '../context/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editCar, setEditCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const { auth_token, currentUser } = useContext(UserContext);
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5, car_id: null });

  useEffect(() => {
    fetchCars();
    fetchBookings();
    fetchReviews();
  }, [auth_token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex(prev => {
        const newState = {};
        cars.forEach(car => {
          newState[car.id] = prev[car.id] === 0 ? 1 : 0;
        });
        return newState;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [cars]);

  const fetchCars = () => {
    const token = auth_token || localStorage.getItem("access_token");
    if (!token) {
      toast.warning("You must be logged in to view cars.");
      return;
    }
    fetch(`${api_url}/cars`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const carsWithStatus = data.map(car => ({
          ...car,
          status: car.status || 'available'
        }));
        setCars(carsWithStatus);
        const initialImageState = {};
        data.forEach(car => {
          initialImageState[car.id] = 0;
        });
        setActiveImageIndex(initialImageState);
      })
      .catch(err => {
        toast.error("Could not load cars.");
        console.error("Error fetching cars:", err.message);
      });
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${api_url}/bookings`, {
        headers: { Authorization: `Bearer ${auth_token}` }
      });
      const data = await res.json();
      setCarBookings(data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${api_url}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    }
  };

  const getCarReviews = (carId) => {
    return reviews.filter(r => r.car_id === carId);
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment || !newReview.rating || !newReview.car_id) {
      toast.error("Please provide comment and rating");
      return;
    }
    try {
      const res = await fetch(`${api_url}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`
        },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");
      toast.success("Review submitted!");
      setReviews(prev => [...prev, { ...newReview, username: currentUser.username }]);
      setNewReview({ comment: '', rating: 5, car_id: null });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getEndDatesForCar = (carId) => {
    return carBookings
      .filter(b => b.car_id === carId && b.end_date)
      .map(b => b.end_date);
  };

  const handleBookCar = (car) => {
    if (car.status !== 'available') {
      toast.error("This car is not available for booking");
      return;
    }
    setSelectedCar(car);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmitBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }
    setIsBooking(true);
    try {
      const response = await fetch(`${api_url}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`
        },
        body: JSON.stringify({
          car_id: selectedCar.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create booking");
      toast.success("Booking created successfully!");
      setSelectedCar(null);
      fetchCars();
      fetchBookings();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const getStatusProps = (status) => {
    switch (status) {
      case 'available':
        return { text: 'Available', color: 'text-green-600', bgColor: 'bg-green-100', buttonText: 'Hire Now', buttonClass: 'bg-blue-600 hover:bg-blue-700', disabled: false };
      case 'booked':
        return { text: 'Booked', color: 'text-yellow-600', bgColor: 'bg-yellow-100', buttonText: 'Hired', buttonClass: 'bg-yellow-400 cursor-not-allowed', disabled: true };
      case 'maintenance':
        return { text: 'Maintenance', color: 'text-red-600', bgColor: 'bg-red-100', buttonText: 'Not Available', buttonClass: 'bg-red-500 cursor-not-allowed', disabled: true };
      default:
        return { text: 'Available', color: 'text-green-600', bgColor: 'bg-green-100', buttonText: 'Book Now', buttonClass: 'bg-blue-600 hover:bg-blue-700', disabled: false };
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Available Cars</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => {
          const statusProps = getStatusProps(car.status);
          const endDates = getEndDatesForCar(car.id);
          const currentImageIndex = activeImageIndex[car.id] || 0;
          const currentImage = currentImageIndex === 0 ? car.image1 : car.image2;
          return (
            <div key={car.id} className="border rounded shadow p-4 bg-white">
              <img src={currentImage} alt={`${car.brand} ${car.model}`} className="w-full h-40 object-cover rounded" />
              <h3 className="font-bold text-lg mt-2">{car.brand} {car.model}</h3>
              <p className="text-gray-600">Ksh {car.price_per_day} per day</p>
              <div className={`mt-2 px-2 py-1 rounded-full inline-block ${statusProps.bgColor}`}>
                <span className={`text-sm font-semibold ${statusProps.color}`}>{statusProps.text}</span>
              </div>
              {endDates.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">Hired Until: {endDates.join(', ')}</div>
              )}
              <button
                onClick={() => handleBookCar(car)}
                disabled={statusProps.disabled}
                className={`mt-3 w-full text-white py-1 px-4 rounded ${statusProps.buttonClass}`}
              >
                {statusProps.buttonText}
              </button>

              {/* Reviews Section */}
              <div className="mt-4 border-t pt-3">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">User Reviews</h4>
                {getCarReviews(car.id).length === 0 ? (
                  <p className="text-xs text-gray-500">No reviews yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {getCarReviews(car.id).map((rev, idx) => (
                      <li key={idx} className="text-sm">
                        <strong className="text-blue-600">{rev.username || 'User'}:</strong> ⭐{rev.rating} - {rev.comment}
                      </li>
                    ))}
                  </ul>
                )}
                {currentUser && (
                  <div className="mt-2">
                    <textarea
                      rows="2"
                      placeholder="Leave a comment..."
                      className="w-full p-2 border rounded text-sm mb-1"
                      value={newReview.car_id === car.id ? newReview.comment : ''}
                      onChange={(e) =>
                        setNewReview(prev => ({
                          ...prev,
                          comment: e.target.value,
                          car_id: car.id
                        }))
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <select
                        value={newReview.car_id === car.id ? newReview.rating : 5}
                        onChange={(e) =>
                          setNewReview(prev => ({
                            ...prev,
                            rating: parseInt(e.target.value),
                            car_id: car.id
                          }))
                        }
                        className="text-sm border p-1 rounded"
                      >
                        {[5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>⭐ {r}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleSubmitReview}
                        className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cars;