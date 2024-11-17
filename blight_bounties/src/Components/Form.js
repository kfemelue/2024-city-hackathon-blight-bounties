import React, { useState } from 'react';
import "./Form.css";
import Header from "./Header";

function Form() {
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    image: null,
    location: null
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to backend
    console.log(formData);
  };

  return (
    <div className="form-container">
      <Header />
      <div className="form-content">
        <h2>Report Blight</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Address:</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <button type="button" onClick={getLocation}>
            Get Current Location
          </button>

          <button type="submit" className="submit-btn">
            Add to Reward
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
