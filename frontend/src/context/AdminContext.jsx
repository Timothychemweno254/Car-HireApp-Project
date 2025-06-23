import React, { createContext, useContext, useState, useCallback } from 'react';
import { api_url } from '../config.json';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { auth_token } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchAllAdminData = useCallback(async () => {
    try {
      const [bookingsRes, carsRes, reviewsRes, usersRes] = await Promise.all([
        fetch(`${api_url}/bookings`, {
          headers: { Authorization: `Bearer ${auth_token}` }
        }),
        fetch(`${api_url}/cars`),
        fetch(`${api_url}/reviews`),
        fetch(`${api_url}/users`, {
          headers: { Authorization: `Bearer ${auth_token}` }
        }),
      ]);

      const [bookingsData, carsData, reviewsData, usersData] = await Promise.all([
        bookingsRes.json(),
        carsRes.json(),
        reviewsRes.json(),
        usersRes.json(),
      ]);

      setBookings(bookingsData);
      setCars(carsData);
      setReviews(reviewsData);
      setUsers(usersData);
    } catch (error) {
      toast.error("Error loading admin data");
      console.error(error);
    }
  }, [auth_token]);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${api_url}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth_token}` },
      });
      const data = await res.json();
      toast.success(data.message || "User deleted");
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const updateBookingStatus = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    const toastId = toast.loading("Updating booking status...");

    try {
      const response = await fetch(`${api_url}/bookings/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.update(toastId, {
        render: data.notification_sent 
          ? "Status updated and notification sent!" 
          : "Status updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
      );
      setStatusUpdates(prev => ({ ...prev, [id]: undefined }));

      // Update car status
      const updatedBooking = bookings.find(b => b.id === id);
      if (updatedBooking) {
        const carId = updatedBooking.car_id;
        const carStatus = newStatus === 'cancelled' ? 'available' : 'booked';

        const carRes = await fetch(`${api_url}/cars/${carId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth_token}`,
          },
          body: JSON.stringify({ status: carStatus }),
        });

        const carData = await carRes.json();

        if (!carRes.ok) {
          throw new Error(carData.error || "Failed to update car status");
        }

        setCars(prev =>
          prev.map(car => car.id === carId ? { ...car, status: carStatus } : car)
        );
        toast.info(`Car marked as ${carStatus}`);
      }

    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Failed to update booking",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      console.error("Booking update error:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      const res = await fetch(`${api_url}/bookings/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth_token}` },
      });
      const data = await res.json();
      toast.success(data.message || "Booking deleted");
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      toast.error("Failed to delete booking");
      console.error(err);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${api_url}/reviews/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth_token}` },
      });
      const data = await res.json();
      toast.success(data.message || "Review deleted");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error("Failed to delete review");
      console.error(err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        bookings,
        cars,
        reviews,
        users,
        statusUpdates,
        setStatusUpdates,
        fetchAllAdminData,
        deleteUser,
        updateBookingStatus,
        deleteBooking,
        deleteReview,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
