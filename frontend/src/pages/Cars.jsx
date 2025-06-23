import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';
import { UserContext } from '../context/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const Cars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const { auth_token, currentUser } = useContext(UserContext);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState({
    brand: '',
    model: '',
    image1: '',
    image2: '',
    price_per_day: '',
    status: 'available',
  });

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, [auth_token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => {
        const newState = {};
        cars.forEach((car) => {
          newState[car.id] = prev[car.id] === 0 ? 1 : 0;
        });
        return newState;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [cars]);

  const fetchCars = () => {
    const token = auth_token || localStorage.getItem('access_token');
    if (!token) {
      toast.warning('You must be logged in to view cars.');
      return;
    }
    fetch(`${api_url}/cars`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const carsWithStatus = data.map((car) => ({
          ...car,
          status: car.status || 'available',
        }));
        setCars(carsWithStatus);
        const initialImageState = {};
        data.forEach((car) => {
          initialImageState[car.id] = 0;
        });
        setActiveImageIndex(initialImageState);
      })
      .catch((err) => {
        toast.error('Could not load cars.');
        console.error('Error fetching cars:', err.message);
      });
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${api_url}/bookings`, {
        headers: { Authorization: `Bearer ${auth_token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setCarBookings(data);
      } else {
        setCarBookings([]);
        console.error('Unexpected bookings format:', data);
      }
    } catch (err) {
      toast.error('Failed to fetch bookings');
      setCarBookings([]);
    }
  };

  const getEndDatesForCar = (carId) =>
    Array.isArray(carBookings)
      ? carBookings
          .filter((b) => b.car_id === carId && b.end_date)
          .map((b) => new Date(b.end_date).toLocaleDateString())
      : [];

  const handleBookCar = (car) => {
    if (car.status !== 'available') {
      toast.error('This car is not available for booking');
      return;
    }
    setSelectedCar(car);
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmitBooking = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }
    setIsBooking(true);
    try {
      const response = await fetch(`${api_url}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({
          car_id: selectedCar.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create booking');
      toast.success('Booking created successfully!');
      setSelectedCar(null);
      fetchCars();
      fetchBookings();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleEditCarClick = (car) => {
    setEditingCar(car);
    setEditForm({
      brand: car.brand,
      model: car.model,
      image1: car.image1,
      image2: car.image2,
      price_per_day: car.price_per_day,
      status: car.status,
    });
  };

  const handleEditFormSubmit = async () => {
    try {
      const res = await fetch(`${api_url}/cars/${editingCar.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update car');
      toast.success('Car updated successfully!');
      setEditingCar(null);
      fetchCars();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStatusProps = (status) => {
    switch (status) {
      case 'available':
        return {
          text: 'Available',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          buttonText: 'Hire Now',
          buttonClass: 'bg-blue-600 hover:bg-blue-700',
          disabled: false,
        };
      case 'booked':
        return {
          text: 'Booked',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          buttonText: 'Hired',
          buttonClass: 'bg-yellow-400 cursor-not-allowed',
          disabled: true,
        };
      case 'maintenance':
        return {
          text: 'Maintenance',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          buttonText: 'Not Available',
          buttonClass: 'bg-red-500 cursor-not-allowed',
          disabled: true,
        };
      default:
        return {
          text: 'Available',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          buttonText: 'Book Now',
          buttonClass: 'bg-blue-600 hover:bg-blue-700',
          disabled: false,
        };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">Available Cars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => {
          const statusProps = getStatusProps(car.status);
          const endDates = getEndDatesForCar(car.id);
          const currentImageIndex = activeImageIndex[car.id] || 0;
          const currentImage = currentImageIndex === 0 ? car.image1 : car.image2;

          return (
            <div
              key={car.id}
              className="border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div
                className="relative cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentImage}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image';
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col flex-grow mt-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {car.brand} {car.model}
                </h3>
                <p className="text-gray-600 mt-1">Ksh {car.price_per_day?.toLocaleString()} per day</p>

                <div className="flex justify-between items-center mt-2">
                  <div className={`px-2 py-1 rounded-full inline-block ${statusProps.bgColor}`}>
                    <span className={`text-xs font-semibold ${statusProps.color}`}>{statusProps.text}</span>
                  </div>
                </div>

                {endDates.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Hired Until: {endDates.join(', ')}
                  </div>
                )}

                {!currentUser?.is_admin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookCar(car);
                    }}
                    disabled={statusProps.disabled}
                    className={`mt-4 w-full text-white py-2 px-4 rounded-lg ${statusProps.buttonClass} transition-colors`}
                  >
                    {statusProps.buttonText}
                  </button>
                )}

                {currentUser?.is_admin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCarClick(car);
                    }}
                    className="mt-4 w-full text-white py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
                  >
                    Edit Car
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book {selectedCar.brand} {selectedCar.model}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate || new Date()}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedCar(null)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={isBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Car Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Brand" className="border p-2 rounded"
                value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} />
              <input type="text" placeholder="Model" className="border p-2 rounded"
                value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} />
              <input type="text" placeholder="Image 1 URL" className="border p-2 rounded"
                value={editForm.image1} onChange={(e) => setEditForm({ ...editForm, image1: e.target.value })} />
              <input type="text" placeholder="Image 2 URL" className="border p-2 rounded"
                value={editForm.image2} onChange={(e) => setEditForm({ ...editForm, image2: e.target.value })} />
              <input type="number" placeholder="Price Per Day" className="border p-2 rounded"
                value={editForm.price_per_day} onChange={(e) => setEditForm({ ...editForm, price_per_day: e.target.value })} />
              <select className="border p-2 rounded"
                value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => setEditingCar(null)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleEditFormSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
