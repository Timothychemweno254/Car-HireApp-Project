import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { api_url } from '../config.json';
import { toast } from 'react-toastify';

const AddCar = () => {
  const { auth_token, currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price_per_day: '',
    image1: '',
    image2: '',
    status: 'available'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.is_admin) {
      toast.error('Only admins can add cars');
      return;
    }

    try {
      const response = await fetch(`${api_url}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        },
        body: JSON.stringify({
          ...formData,
          price_per_day: parseFloat(formData.price_per_day)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Car added successfully!');
        navigate('/admin');
      } else {
        toast.error(data.error || 'Failed to add car');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.3)_inset] w-full max-w-md transform-style-preserve-3d transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
        <h1 className="text-2xl font-bold text-sky-600 text-center mb-6 relative">
          Add New Car
          <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-[60px] h-[3px] bg-gradient-to-r from-sky-600 to-sky-300 rounded-[3px]"></span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent peer"
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600 -top-2 text-sm bg-white px-1">
                Brand
              </label>
            </div>
            
            <div className="relative">
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent peer"
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600 -top-2 text-sm bg-white px-1">
                Model
              </label>
            </div>
            
            <div className="relative">
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent peer"
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600 -top-2 text-sm bg-white px-1">
                Price Per Day
              </label>
            </div>
            
            <div className="relative">
              <input
                type="url"
                name="image1"
                value={formData.image1}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent peer"
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600 -top-2 text-sm bg-white px-1">
                Image URL 1
              </label>
            </div>
            
            <div className="relative">
              <input
                type="url"
                name="image2"
                value={formData.image2}
                onChange={handleChange}
                required
                placeholder=" "
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent peer"
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600 -top-2 text-sm bg-white px-1">
                Image URL 2
              </label>
            </div>
            
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <label className="absolute left-4 -top-2 text-sm bg-white px-1 text-sky-600">
                Status
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="relative overflow-hidden px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none"
            >
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;