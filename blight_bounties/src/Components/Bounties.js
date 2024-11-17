import React, { useState, useEffect } from 'react';
import "./Bounties.css";
import Header from "./Header";
import ClaimModal from './ClaimModal';

function BountyCard({ bounty, onClaimClick }) {
  return (
    <div className="bounty-card">
      <img src={bounty.image} alt="Blight" className="bounty-image" />
      <div className="bounty-content">
        <h3>{bounty.title}</h3>
        <p>{bounty.description}</p>
        <div className="bounty-details">
          <span>Created: {new Date(bounty.creationDate).toLocaleDateString()}</span>
          <span>Reports: {bounty.reportCount}</span>
        </div>
        <div className="bounty-location">
          {/* TODO: Implement map component */}
          <p>Location: {bounty.address}</p>
        </div>
        <button 
          className="claim-btn" 
          onClick={() => onClaimClick(bounty)}
        >
          Claim Bounty
        </button>
      </div>
    </div>
  );
}

function Bounties() {
  const [bounties, setBounties] = useState([]);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  useEffect(() => {
    // TODO: Fetch bounties from API
    const fetchBounties = async () => {
      try {
        // Placeholder data
        const mockBounties = [
          {
            id: 1,
            title: "Illegal Dumping",
            description: "Large pile of trash behind building",
            creationDate: "2024-03-20",
            reportCount: 3,
            address: "123 Main St",
            image: "placeholder.jpg"
          },
          {
            id: 1,
            title: "Illegal Dumping",
            description: "Large pile of trash behind building",
            creationDate: "2024-03-20",
            reportCount: 3,
            address: "123 Main St",
            image: "placeholder.jpg"
          },
          {
            id: 1,
            title: "Illegal Dumping",
            description: "Large pile of trash behind building",
            creationDate: "2024-03-20",
            reportCount: 3,
            address: "123 Main St",
            image: "placeholder.jpg"
          }
          // Add more mock data as needed
        ];
        setBounties(mockBounties);
      } catch (error) {
        console.error("Error fetching bounties:", error);
      }
    };

    fetchBounties();
  }, []);

  const handleClaimClick = (bounty) => {
    setSelectedBounty(bounty);
    setShowClaimModal(true);
  };

  const handleClaimSubmit = async (claimData) => {
    try {
      // TODO: Replace with actual API call
      console.log('Submitting claim:', { bountyId: selectedBounty.id, ...claimData });
      
      // Close modal and show success message
      setShowClaimModal(false);
      setSelectedBounty(null);
      // You might want to refresh the bounties list here
    } catch (error) {
      console.error('Error submitting claim:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="bounties-container">
      <Header />
      <div className="bounties-content">
        <h2>Available Bounties</h2>
        <div className="bounties-grid">
          {bounties.map(bounty => (
            <BountyCard 
              key={bounty.id} 
              bounty={bounty} 
              onClaimClick={handleClaimClick}
            />
          ))}
        </div>
      </div>

      {showClaimModal && (
        <ClaimModal
          bounty={selectedBounty}
          onClose={() => {
            setShowClaimModal(false);
            setSelectedBounty(null);
          }}
          onSubmit={handleClaimSubmit}
        />
      )}
    </div>
  );
}

export default Bounties;
