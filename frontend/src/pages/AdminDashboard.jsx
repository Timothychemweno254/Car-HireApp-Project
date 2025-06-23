import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { AdminContext } from '../context/AdminContext';
import { api_url } from '../config.json';

const AdminDashboard = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const {
    bookings,
    cars,
    reviews,
    users,
    statusUpdates,
    setStatusUpdates,
    fetchAllAdminData,
    deleteUser,
    deleteBooking,
    deleteReview,
  } = useContext(AdminContext);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (!currentUser?.is_admin) {
      toast.error("Admins only");
      return navigate("/login");
    }
    fetchAllAdminData();
  }, [currentUser, navigate, fetchAllAdminData]);

  const updateBookingStatus = async (bookingId, carId) => {
    const updatedStatus = statusUpdates[bookingId];
    if (!updatedStatus) return;

    try {
      const res = await fetch(`${api_url}/bookings/${bookingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ status: updatedStatus })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update booking");

      // Automatically update the car status too
      let newCarStatus = null;
      if (updatedStatus === 'confirmed') newCarStatus = 'booked';
      else if (updatedStatus === 'cancelled') newCarStatus = 'available';

      if (newCarStatus) {
        await fetch(`${api_url}/cars/${carId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify({ status: newCarStatus })
        });
      }

      toast.success("Booking & Car status updated");
      fetchAllAdminData(); // Refresh data
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4 font-medium">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'cars':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Brand</th>
                  <th className="px-6 py-3 text-left">Model</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cars.map(car => (
                  <tr key={car.id}>
                    <td className="px-6 py-4 font-medium">{car.brand}</td>
                    <td className="px-6 py-4">{car.model}</td>
                    <td className="px-6 py-4">Ksh {car.price_per_day}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        car.status === 'available' ? 'bg-green-100 text-green-800' :
                        car.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'bookings':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Car</th>
                  <th className="px-6 py-3 text-left">Dates</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="px-6 py-4">{b.user_id}</td>
                    <td className="px-6 py-4">{b.car_id}</td>
                    <td className="px-6 py-4">{b.start_date} - {b.end_date}</td>
                    <td className="px-6 py-4">
                      <select
                        defaultValue={b.status}
                        onChange={e =>
                          setStatusUpdates(prev => ({ ...prev, [b.id]: e.target.value }))
                        }
                        className="text-sm p-1 rounded bg-white border"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => updateBookingStatus(b.id, b.car_id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'reviews':
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Car</th>
            <th className="px-6 py-3 text-left">Rating</th>
            <th className="px-6 py-3 text-left">Comment</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reviews.map(r => (
            <tr key={r.id}>
              <td className="px-6 py-4">{r.user_id}</td>
              <td className="px-6 py-4">{r.car_id}</td>
              <td className="px-6 py-4">{r.rating}</td>
              <td className="px-6 py-4">{r.comment}</td>
              <td className="px-6 py-4">
                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this review?")) return;

                    const toastId = toast.loading("Deleting review...");
                    try {
                      const res = await fetch(`${api_url}/reviews/${r.id}/`, {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                      });

                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Failed to delete review");

                      toast.update(toastId, {
                        render: data.message || "Review deleted",
                        type: "success",
                        isLoading: false,
                        autoClose: 3000,
                      });

                      // Update state locally (optional if fetchAllAdminData is called)
                      fetchAllAdminData();
                    } catch (err) {
                      toast.update(toastId, {
                        render: err.message || "Error deleting review",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                      });
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-700">Admin Dashboard</h1>
        <button
          onClick={logout_user}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('cars')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'cars' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Cars
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reviews
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          {activeTab === 'users' && 'Users'}
          {activeTab === 'cars' && 'Cars'}
          {activeTab === 'bookings' && 'Bookings'}
          {activeTab === 'reviews' && 'Reviews'}
        </h2>
        {renderTable()}
      </div>
    </div>
  );
};

export default AdminDashboard;