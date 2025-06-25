import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api_url } from '../config.json';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

 useEffect(() => {
  const fetchCarDetails = async () => {
    try {
      const [carRes, reviewsRes] = await Promise.all([
        fetch(`${api_url}/cars/${id}`),
        fetch(`${api_url}/reviews/car/${id}`)
      ]);
      
      const carData = await carRes.json();
      const reviewsData = await reviewsRes.json();
      
      setCar(carData);
      setReviews(reviewsData); 
    } catch (error) {
      toast.error("Failed to load car details");
    } finally {
      setLoading(false);
    }
  };

  fetchCarDetails();
}, [id]);


const handleSubmitReview = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access_token'); 
  if (!token) return toast.error('You must be logged in to comment');

  try {
    
    const response = await fetch(`${api_url}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        car_id: parseInt(id),            
        comment: newComment,
        rating: parseInt(rating)         
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to submit review');
    }

    const result = await response.json();

    
    const userRes = await fetch(`${api_url}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const userData = await userRes.json();

    const newReview = {
      id: result.review_id,
      user_id: userData.id,
      username: userData.username,
      rating,
      comment: newComment,
      created_at: new Date().toISOString()
    };

    setReviews([...reviews, newReview]);
    setNewComment('');
    setRating(5);
    toast.success('Review submitted successfully!');
  } catch (error) {
    toast.error(error.message);
  }
};

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!car) return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-xl font-bold text-blue-600">Car not found</h1>
      <button 
        onClick={() => navigate('/cars')}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
      >
        Back to Cars
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-green-100">
          <div className="flex space-x-2 mb-3">
            <div 
              className={`cursor-pointer flex-1 ${activeImage === 0 ? 'ring-1 ring-blue-500' : ''}`}
              onClick={() => setActiveImage(0)}
            >
              <img 
                src={car.image1} 
                alt={`${car.brand} ${car.model} - 1`} 
                className="w-full h-20 object-cover rounded"
              />
            </div>
            <div 
              className={`cursor-pointer flex-1 ${activeImage === 1 ? 'ring-1 ring-blue-500' : ''}`}
              onClick={() => setActiveImage(1)}
            >
              <img 
                src={car.image2} 
                alt={`${car.brand} ${car.model} - 2`} 
                className="w-full h-20 object-cover rounded"
              />
            </div>
          </div>

          

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-black">{car.brand} {car.model}</h1>
            
            <div className="flex items-center justify-between">
              <span className="text-md font-semibold text-blue-600">
                Ksh {car.price_per_day.toLocaleString()} / day
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                car.status === 'available' ? 'bg-green-100 text-green-800' :
                car.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600 text-xs">Brand</div>
                <div className="font-medium text-sm text-black">{car.brand}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600 text-xs">Model</div>
                <div className="font-medium text-sm text-black">{car.model}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600 text-xs">Year</div>
                <div className="font-medium text-sm text-black">{car.year}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-gray-600 text-xs">Color</div>
                <div className="font-medium text-sm text-black">{car.color}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Comments Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
          <h2 className="text-lg font-bold text-black mb-3 border-b pb-1">Reviews</h2>
          
          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-4 bg-blue-50 p-2 rounded">
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Your review..."
                className="flex-1 p-2 border rounded text-sm text-black"
                rows="2"
                required
              />
              <button 
                type="submit"
                className="ml-2 bg-blue-600 text-white px-3 rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Post
              </button>
            </div>
          </form>

          {/* Compact Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm text-black">{review.username}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>No reviews yet be the first to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;