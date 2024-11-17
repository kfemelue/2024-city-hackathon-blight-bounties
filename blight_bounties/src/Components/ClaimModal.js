import React, { useState, useEffect } from 'react';
import './ClaimModal.css';

function ClaimModal({ bounty, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [formData, setFormData] = useState({
    cleanupPhoto: null,
    transportPhoto: null
  });

  const verifyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLocation);
          
          // Calculate distance between user and bounty location
          const distance = calculateDistance(
            userLocation,
            bounty.location // Assuming bounty has location data
          );
          
          // Verify if user is within 100 meters of the reported location
          if (distance <= 100) {
            setLocationVerified(true);
          } else {
            alert("You must be at the reported location to begin this bounty");
          }
        },
        (error) => {
          alert("Please enable location services to complete this bounty");
        }
      );
    }
  };

  const calculateDistance = (point1, point2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cleanupPhoto || !formData.transportPhoto) {
      alert("Please provide both required photos");
      return;
    }
    onSubmit({ ...formData, location });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {step === 1 ? (
          // Step 1: Confirmation and Location Verification
          <div className="confirmation-step">
            <h2>Claim Bounty</h2>
            <div className="bounty-details">
              <p><strong>Location:</strong> {bounty.address}</p>
              <p><strong>Description:</strong> {bounty.description}</p>
              <img 
                src={bounty.image} 
                alt="Reported blight" 
                className="bounty-reference-image"
              />
            </div>
            <h3>The Bounty is Now Yours!</h3>
            <p className="verification-text">
              To complete this bounty, you must:
              <ul>
                <li>Be at the reported location</li>
                <li>Provide photo evidence of cleanup</li>
                <li>Provide photo evidence of proper disposal</li>
              </ul>
            </p>

            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  verifyLocation();
                  if (locationVerified) setStep(2);
                }} 
                className="verify-btn"
              >
                Verify Location & Continue
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Photo Evidence Upload
          <div className="evidence-step">
            <h2>Provide Evidence</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Photo of Cleaned Location:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'cleanupPhoto')}
                  required
                />
              </div>

              <div className="form-group">
                <label>Photo of Waste Transport/Disposal:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'transportPhoto')}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" onClick={() => setStep(1)} className="back-btn">
                  Back
                </button>
                <button type="submit" className="submit-btn">
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimModal; 