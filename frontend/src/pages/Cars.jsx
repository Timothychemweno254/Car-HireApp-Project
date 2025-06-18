import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const { auth_token } = useContext(UserContext);

  useEffect(() => {
    const token = auth_token || localStorage.getItem("access_token");

    if (!token) {
      toast.warning("You must be logged in to view cars.");
      return;
    }

    fetch("http://127.0.0.1:5000/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch cars");
        return res.json();
      })
      .then(data => {
        setCars(data);
      })
      .catch(err => {
        toast.error("Could not load cars.");
        console.error("Error fetching cars:", err.message);
      });
  }, [auth_token]);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Available Cars</h2>

      {cars.length === 0 ? (
        <p className="text-gray-500">No cars available or failed to load.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border rounded shadow p-4 bg-white">
              <img
                src={car.image1}
                alt={car.model}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
              <p className="text-gray-600">Ksh {car.price_per_day} per day</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;
