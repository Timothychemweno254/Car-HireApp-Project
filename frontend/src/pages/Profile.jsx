import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api_url } from '../config.json';

const Profile = () => {
  const { currentUser, update_user_profile, delete_profile, logout_user, auth_token } = useContext(UserContext);
  const navigate = useNavigate();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const fileInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`profileImage_${currentUser?.id}`) || 
    'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'
  );

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      fetchCars();

      const savedImage = localStorage.getItem(`profileImage_${currentUser.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [currentUser]);

  const fetchCars = async () => {
    try {
      const res = await fetch(`${api_url}/cars`, {
        headers: { Authorization: `Bearer ${auth_token}` }
      });
      const data = await res.json();
      setCars(data);
      fetchUserBookings(data);
    } catch (err) {
      toast.error("Failed to fetch cars");
    }
  };

  const fetchUserBookings = async (carList) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${api_url}/bookings/user/${currentUser.id}/`, {
        headers: { Authorization: `Bearer ${auth_token}` }
      });
      const data = await res.json();
      const enriched = data.map(b => {
        const car = carList.find(c => c.id === b.car_id);
        return { ...b, car };
      });
      setBookings(enriched);
    } catch (err) {
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        
        localStorage.setItem(`profileImage_${currentUser.id}`, imageDataUrl);
        toast.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const cancelBooking = async (id, carId) => {
    if (!window.confirm("Cancel this booking?")) return;
    const toastId = toast.loading("Cancelling...");
    try {
      const res = await fetch(`${api_url}/bookings/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error cancelling");

      
      await fetch(`${api_url}/cars/${carId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        body: JSON.stringify({ status: 'available' })
      });

      toast.update(toastId, { render: "Booking cancelled", type: "success", isLoading: false, autoClose: 3000 });
      fetchUserBookings(cars);
    } catch (err) {
      toast.update(toastId, { render: err.message, type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!email || !currentPassword) return toast.error("Fill in required fields");
    if (newPassword && newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const result = await update_user_profile(currentUser.id, email, newPassword || currentPassword);
      if (result?.error) toast.error(result.error);
      else toast.success(result.message || "Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleLogout = () => {
    logout_user();
    navigate("/cars");
  };

  const calculateTotal = (booking) => {
    if (!booking.car?.price_per_day) return 0;
    const days = (new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24);
    return booking.car.price_per_day * days;
  };

  const totalCost = bookings.reduce((sum, b) => sum + calculateTotal(b), 0).toFixed(2);

  if (!currentUser) return <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Access</h2>
      <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
      <button 
        onClick={() => navigate('/login')} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
      >
        Go to Login
      </button>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Manage your account and bookings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="relative mb-5 group">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full w-32 h-32 object-cover border-4 border-blue-100 shadow-md group-hover:opacity-80 transition duration-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <div className="bg-white p-3 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    capture="user" 
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{currentUser.username}</h2>
                <p className="text-sm text-gray-500 mt-1">{currentUser.email}</p>
                <span className={`mt-3 px-4 py-1 rounded-full text-xs font-semibold ${currentUser.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  {currentUser.is_admin ? 'Administrator' : 'Standard User'}
                </span>
              </div>

              <div className="border-t border-gray-200 px-4 py-5">
                <nav className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => setActiveTab('current')} 
                    className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'current' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    My Bookings
                  </button>
                </nav>
              </div>

              <div className="border-t border-gray-200 p-4">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

            
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {activeTab === 'profile' && (
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                    {!showUpdateForm ? (
                      <button
                        onClick={() => setShowUpdateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowUpdateForm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!showUpdateForm ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {currentUser.username}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          {currentUser.is_admin ? 'Administrator' : 'Standard User'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {currentUser.username}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                          <input 
                            type="email" 
                            id="email"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password*</label>
                          <input 
                            type="password" 
                            id="currentPassword"
                            value={currentPassword} 
                            onChange={e => setCurrentPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input 
                            type="password" 
                            id="newPassword"
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                          <input 
                            type="password" 
                            id="confirmPassword"
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Save Changes
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 mb-4">Deleting your account will permanently remove all your data including bookings. This action cannot be undone.</p>
                      <button 
                        onClick={delete_profile} 
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'current' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
                      <p className="mt-1 text-gray-500">You haven't made any bookings yet.</p>
                      <button 
                        onClick={() => navigate('/cars')} 
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Browse Cars
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {bookings.map(booking => (
                          <div key={booking.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  {booking.car?.image_url && (
                                    <img 
                                      src={booking.car.image_url} 
                                      alt={`${booking.car.brand} ${booking.car.model}`} 
                                      className="w-20 h-20 object-cover rounded-lg"
                                    />
                                  )}
                                  <div>
                                    <h3 className="font-bold text-lg text-gray-800">
                                      {booking.car?.brand} {booking.car?.model}
                                    </h3>
                                    <p className="text-gray-600">
                                      <span className="font-medium">Dates:</span> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                      <span className="font-medium">Price:</span> Ksh {booking.car?.price_per_day?.toFixed(2)}/day
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <div className="mt-2 text-lg font-bold text-blue-600">
                                  Ksh {calculateTotal(booking).toFixed(2)}
                                </div>
                                {booking.status === 'pending' && (
                                  <button 
                                    onClick={() => cancelBooking(booking.id, booking.car_id)} 
                                    className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    Cancel Booking
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold text-gray-800">Total Spent</h4>
                          <span className="text-2xl font-bold text-blue-700">Ksh {totalCost}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile