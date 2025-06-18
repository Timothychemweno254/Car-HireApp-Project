import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPasswordForDelete, setConfirmPasswordForDelete] = useState('');

  if (!currentUser) {
    return <div className="text-center mt-20">Please log in to view your profile.</div>;
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // TODO: Send PATCH/PUT to backend with username, email, and new password
    toast.success('Profile updated successfully!');
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmEmail !== currentUser.email) {
      toast.error('Email does not match');
      return;
    }
    if (!confirmPasswordForDelete) {
      toast.error('Password is required');
      return;
    }

    // TODO: Send DELETE request with credentials to backend
    toast.success('Account deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-[90%] md:w-[60%] lg:w-[40%]">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
            alt="Profile"
            className="rounded-full w-32 h-32 mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">{currentUser.username}</h2>
          <p className="text-sm text-gray-600">{currentUser.email}</p>
          <p className="text-sm font-semibold mt-2">
            Role:{" "}
            <span className={`px-3 py-1 rounded-full text-white ${currentUser.is_admin ? 'bg-blue-600' : 'bg-green-600'}`}>
              {currentUser.is_admin ? 'Admin' : 'User'}
            </span>
          </p>
        </div>

        {/* Settings Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-sky-600 hover:bg-sky-800 text-white px-6 py-2 rounded transition"
          >
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
        </div>

        {/* Settings Menu */}
        {showSettings && (
          <div className="space-y-4">
            <button
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              {showUpdateForm ? 'Cancel Update' : 'Update Profile'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
            >
              {showDeleteConfirm ? 'Cancel Delete' : 'Delete Account'}
            </button>
            <button
              onClick={logout_user}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {/* Profile Update Form */}
        {showUpdateForm && (
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-sky-500 text-white py-3 rounded hover:bg-sky-700">
              Save Changes
            </button>
          </form>
        )}

        {/* Delete Account Form */}
        {showDeleteConfirm && (
          <form onSubmit={handleDelete} className="mt-6 space-y-4 bg-red-50 p-4 rounded">
            <p className="text-red-600 font-medium">Confirm account deletion:</p>
            <div>
              <label className="block text-sm font-medium text-gray-600">Your Email</label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Your Password</label>
              <input
                type="password"
                value={confirmPasswordForDelete}
                onChange={(e) => setConfirmPasswordForDelete(e.target.value)}
                className="w-full mt-1 p-3 border rounded focus:outline-none focus:ring focus:ring-red-400"
              />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
              Delete Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
