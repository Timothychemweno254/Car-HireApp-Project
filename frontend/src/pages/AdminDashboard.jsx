import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { AdminContext } from '../context/AdminContext';
import { api_url } from '../config.json';

const AdminDashboard = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const {
    bookings, cars, reviews, users,
    statusUpdates, setStatusUpdates,
    fetchAllAdminData, deleteUser, deleteBooking, deleteReview
  } = useContext(AdminContext);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (!currentUser?.is_admin) {
      
      navigate("/Admin");
    } else {
      fetchAllAdminData();
    }
  }, [currentUser, navigate, fetchAllAdminData]);

  const confirmAction = async (title, text, confirmText = "Confirm") => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      backdrop: 'rgba(0,0,0,0.4)',
      customClass: {
        container: 'font-sans',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md'
      }
    });
    return result.isConfirmed;
  };

  const updateBookingStatus = async (bookingId, carId) => {
    const updatedStatus = statusUpdates[bookingId];
    if (!updatedStatus) return;

    const toastId = toast.loading('Updating status...');
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

      
      let newCarStatus = updatedStatus === 'confirmed' ? 'booked' : 
                        updatedStatus === 'cancelled' ? 'available' : null;

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

      toast.update(toastId, {
        render: "Status updated successfully",
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        className: 'bg-green-50 text-green-800'
      });
      fetchAllAdminData();
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        className: 'bg-red-50 text-red-800'
      });
    }
  };

  
  const tdClass = "px-6 py-4 whitespace-nowrap text-sm";
  const thClass = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
  const actionButtonClass = "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const renderTable = (columns, data, renderRow) => (
    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={`${thClass} text-white`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => renderTable(
    ['ID', 'Username', 'Email', 'Role', 'Actions'],
    users,
    (user) => (
      <>
        <td className={`${tdClass} font-medium text-gray-900`}>{user.id}</td>
        <td className={`${tdClass} text-blue-600`}>{user.username}</td>
        <td className={`${tdClass} text-gray-600`}>{user.email}</td>
        <td className={tdClass}>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {user.is_admin ? 'Admin' : 'User'}
          </span>
        </td>
        <td className={tdClass}>
          <button
            onClick={async () => {
              const confirmed = await confirmAction(
                "Delete User",
                `Are you sure you want to delete ${user.username}?`,
                "Delete User"
              );
              if (confirmed) {
                const toastId = toast.loading('Deleting user...', {
                  className: 'bg-blue-50 text-blue-800'
                });
                try {
                  await deleteUser(user.id);
                  toast.update(toastId, {
                    render: "User deleted successfully",
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-green-50 text-green-800'
                  });
                } catch (error) {
                  toast.update(toastId, {
                    render: error.message || "Failed to delete user",
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-red-50 text-red-800'
                  });
                }
              }
            }}
            className={`${actionButtonClass} bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500`}
          >
            Delete
          </button>
        </td>
      </>
    )
  );

  const renderCars = () => renderTable(
    ['Brand', 'Model', 'Price', 'Status', 'Actions'],
    cars,
    (car) => (
      <>
        <td className={`${tdClass} font-medium text-gray-900`}>{car.brand}</td>
        <td className={`${tdClass} text-gray-600`}>{car.model}</td>
        <td className={`${tdClass} font-medium text-blue-600`}>Ksh {car.price_per_day}</td>
        <td className={tdClass}>
          <select
            defaultValue={car.status}
            onChange={async (e) => {
              const newStatus = e.target.value;
              const toastId = toast.loading('Updating car status...', {
                className: 'bg-blue-50 text-blue-800'
              });
              try {
                const res = await fetch(`${api_url}/cars/${car.id}/`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                  },
                  body: JSON.stringify({ status: newStatus })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                
                toast.update(toastId, {
                  render: "Car status updated",
                  type: 'success',
                  isLoading: false,
                  autoClose: 3000,
                  className: 'bg-green-50 text-green-800'
                });
                fetchAllAdminData();
              } catch (err) {
                toast.update(toastId, {
                  render: err.message,
                  type: 'error',
                  isLoading: false,
                  autoClose: 3000,
                  className: 'bg-red-50 text-red-800'
                });
              }
            }}
            className={`text-sm p-1.5 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              car.status === 'available' ? 'border-green-300 bg-green-50 text-green-800' : 
              car.status === 'booked' ? 'border-yellow-300 bg-yellow-50 text-yellow-800' : 
              'border-red-300 bg-red-50 text-red-800'
            }`}
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </td>
        <td className={tdClass}>
          <button
            onClick={async () => {
              const confirmed = await confirmAction(
                "Delete Car",
                `Are you sure you want to delete ${car.brand} ${car.model}?`,
                "Delete Car"
              );
              if (confirmed) {
                const toastId = toast.loading('Deleting car...', {
                  className: 'bg-blue-50 text-blue-800'
                });
                try {
                  const res = await fetch(`${api_url}/cars/${car.id}/`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Failed to delete car");
                  fetchAllAdminData();
                  toast.update(toastId, {
                    render: "Car deleted successfully",
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-green-50 text-green-800'
                  });
                } catch (err) {
                  toast.update(toastId, {
                    render: err.message || "Error deleting car",
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-red-50 text-red-800'
                  });
                }
              }
            }}
            className={`${actionButtonClass} bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500`}
          >
            Delete
          </button>
        </td>
      </>
    )
  );

  const renderBookings = () => renderTable(
    ['User ID', 'Car ID', 'Start Date', 'End Date', 'Status', 'Actions'],
    bookings,
    (b) => (
      <>
        <td className={`${tdClass} font-medium text-gray-900`}>{b.user_id}</td>
        <td className={`${tdClass} text-gray-600`}>{b.car_id}</td>
        <td className={`${tdClass} text-gray-600`}>{b.start_date}</td>
        <td className={`${tdClass} text-gray-600`}>{b.end_date}</td>
        <td className={tdClass}>
          <select
            defaultValue={b.status}
            onChange={e => setStatusUpdates(prev => ({ ...prev, [b.id]: e.target.value }))}
            className={`text-sm p-1.5 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              b.status === 'confirmed' ? 'border-green-300 bg-green-50 text-green-800' : 
              b.status === 'cancelled' ? 'border-red-300 bg-red-50 text-red-800' : 
              'border-yellow-300 bg-yellow-50 text-yellow-800'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
        <td className={`${tdClass} space-x-2`}>
          <button 
            onClick={() => updateBookingStatus(b.id, b.car_id)}
            className={`${actionButtonClass} bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-500`}
          >
            Save
          </button>
          <button 
            onClick={async () => {
              const confirmed = await confirmAction(
                "Delete Booking",
                "Are you sure you want to delete this booking?",
                "Delete Booking"
              );
              if (confirmed) {
                const toastId = toast.loading('Deleting booking...', {
                  className: 'bg-blue-50 text-blue-800'
                });
                try {
                  await deleteBooking(b.id);
                  toast.update(toastId, {
                    render: "Booking deleted successfully",
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-green-50 text-green-800'
                  });
                } catch (error) {
                  toast.update(toastId, {
                    render: error.message || "Failed to delete booking",
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-red-50 text-red-800'
                  });
                }
              }
            }}
            className={`${actionButtonClass} bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500`}
          >
            Delete
          </button>
        </td>
      </>
    )
  );

  const renderReviews = () => renderTable(
    ['User ID', 'Car ID', 'Rating', 'Comment', 'Actions'],
    reviews,
    (r) => (
      <>
        <td className={`${tdClass} font-medium text-gray-900`}>{r.user_id}</td>
        <td className={`${tdClass} text-gray-600`}>{r.car_id}</td>
        <td className={tdClass}>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </td>
        <td className={`${tdClass} text-gray-600`}>{r.comment}</td>
        <td className={tdClass}>
          <button
            onClick={async () => {
              const confirmed = await confirmAction(
                "Delete Review",
                "Are you sure you want to delete this review?",
                "Delete Review"
              );
              if (confirmed) {
                const toastId = toast.loading('Deleting review...', {
                  className: 'bg-blue-50 text-blue-800'
                });
                try {
                  await deleteReview(r.id);
                  toast.update(toastId, {
                    render: "Review deleted successfully",
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-green-50 text-green-800'
                  });
                } catch (error) {
                  toast.update(toastId, {
                    render: error.message || "Failed to delete review",
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    className: 'bg-red-50 text-red-800'
                  });
                }
              }
            }}
            className={`${actionButtonClass} bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500`}
          >
            Delete
          </button>
        </td>
      </>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your application data</p>
          </div>
          <button
            onClick={logout_user}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        
        <div className="mb-8">
          <nav className="flex space-x-2 overflow-x-auto pb-2">
            {['users', 'cars', 'bookings', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'cars' && 'Car Inventory'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'reviews' && 'Customer Reviews'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTab === 'users' && 'Manage all user accounts and permissions'}
              {activeTab === 'cars' && 'View and update your car inventory'}
              {activeTab === 'bookings' && 'Process and manage customer bookings'}
              {activeTab === 'reviews' && 'View and moderate customer reviews'}
            </p>
          </div>
          <div className="p-6">
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'cars' && renderCars()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'reviews' && renderReviews()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;