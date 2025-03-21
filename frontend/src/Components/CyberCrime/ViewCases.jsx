// ViewCases.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewCases.css';

const ViewCases = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
// Frontend fix
useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // Axios already parses JSON responses automatically
        const response = await axios.get('http://localhost:4000/api/cybercrime/my-cases', {
          withCredentials: true
        });
        
        // With axios, the response data is in response.data
        if (response.data.success) {
          setCases(response.data.cases || []);
        } else {
          setError(response.data.message || 'Failed to fetch cases');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, []);

  const handleViewCase = async (caseId) => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/cases/${caseId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedCase(data.case);
      } else {
        setError(data.message || 'Failed to fetch case details');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      handleViewCase(searchId);
    }
  };

  // Sample data for demonstration
  const sampleCases = [
    {
      caseId: 'CC-202503-0001',
      complainant: { name: 'John Doe' },
      crimeDetails: { 
        crimeType: 'Phishing', 
        crimeDateTime: '2025-03-01T10:30:00Z',
        description: 'A detailed description of the phishing attempt that occurred through email, claiming to be from a financial institution and requesting personal banking details.'
      },
      caseStatus: 'Under Review',
      priority: 'High',
      submittedAt: '2025-03-01T12:45:00Z'
    },
    {
      caseId: 'CC-202503-0002',
      complainant: { 
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        mobile: '9876543210' 
      },
      crimeDetails: { 
        crimeType: 'Identity Theft', 
        crimeDateTime: '2025-03-03T15:20:00Z',
        location: 'Online',
        platformOrWebsite: 'social-network.com'
      },
      caseStatus: 'Investigation',
      priority: 'Medium',
      submittedAt: '2025-03-03T17:30:00Z'
    },
    {
      caseId: 'CC-202502-0015',
      complainant: { name: 'Alex Johnson' },
      crimeDetails: { 
        crimeType: 'Data Breach', 
        crimeDateTime: '2025-02-27T08:15:00Z',
        monetaryLoss: { amount: 5000, currency: 'USD' }
      },
      caseStatus: 'Submitted',
      priority: 'Urgent',
      submittedAt: '2025-02-27T09:45:00Z'
    }
  ];

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // For demo purposes, use sample cases
  const displayCases = cases.length > 0 ? cases : [];
  const displayCase = selectedCase || (searchId && sampleCases.find(c => c.caseId === searchId));

  return (
    <div className="cases-container">
      <h1 className="main-title">Cyber Crime Case Management</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Case ID (e.g., CC-202503-0001)"
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search Case
          </button>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid-container">
        {/* Cases List */}
        <div className="cases-list-container">
          <div className="card">
            <div className="card-header">
              <h2>Recent Cases</h2>
            </div>
            {loading && !displayCases.length ? (
              <div className="loading-message">Loading cases...</div>
            ) : (
              <ul className="cases-list">
                {displayCases.map((caseItem) => (
                  <li 
                    key={caseItem.caseId} 
                    className="case-item"
                    onClick={() => {
                      setSelectedCase(caseItem);
                      setSearchId(caseItem.caseId);
                    }}
                  >
                    <div className="case-item-content">
                      <div>
                        <h3 className="case-id">{caseItem.caseId}</h3>
                        <p className="complainant-name">{caseItem.complainant.name}</p>
                        <p className="submission-date">{formatDate(caseItem.submittedAt)}</p>
                      </div>
                      <div className="case-badges">
                        <span className={`badge priority-${caseItem.priority.toLowerCase()}`}>
                          {caseItem.priority}
                        </span>
                        <span className={`badge status-${caseItem.caseStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                          {caseItem.caseStatus}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Case Detail View */}
        <div className="case-detail-container">
          {loading && searchId ? (
            <div className="card loading-message">
              Loading case details...
            </div>
          ) : displayCase ? (
            <div className="card">
              <div className="case-detail-header">
                <div className="case-header-content">
                  <h2 className="case-detail-id">Case: {displayCase.caseId}</h2>
                  <div className="case-header-badges">
                    <span className={`badge priority-${displayCase.priority.toLowerCase()}`}>
                      {displayCase.priority}
                    </span>
                    <span className={`badge status-${displayCase.caseStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                      {displayCase.caseStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="case-detail-content">
                {/* Complainant Information */}
                <div className="section">
                  <h3 className="section-title">Complainant Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <p className="info-label">Name</p>
                      <p className="info-value">{displayCase.complainant.name}</p>
                    </div>
                    {displayCase.complainant.email && (
                      <div className="info-item">
                        <p className="info-label">Email</p>
                        <p className="info-value">{displayCase.complainant.email}</p>
                      </div>
                    )}
                    {displayCase.complainant.mobile && (
                      <div className="info-item">
                        <p className="info-label">Mobile</p>
                        <p className="info-value">{displayCase.complainant.mobile}</p>
                      </div>
                    )}
                    {displayCase.complainant.idProofType && (
                      <div className="info-item">
                        <p className="info-label">ID Type</p>
                        <p className="info-value">{displayCase.complainant.idProofType}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Crime Details */}
                <div className="section">
                  <h3 className="section-title">Crime Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <p className="info-label">Crime Type</p>
                      <p className="info-value">{displayCase.crimeDetails.crimeType}</p>
                    </div>
                    {displayCase.crimeDetails.subCategory && (
                      <div className="info-item">
                        <p className="info-label">Sub-Category</p>
                        <p className="info-value">{displayCase.crimeDetails.subCategory}</p>
                      </div>
                    )}
                    <div className="info-item">
                      <p className="info-label">Date & Time</p>
                      <p className="info-value">{formatDate(displayCase.crimeDetails.crimeDateTime)}</p>
                    </div>
                    {displayCase.crimeDetails.location && (
                      <div className="info-item">
                        <p className="info-label">Location</p>
                        <p className="info-value">{displayCase.crimeDetails.location}</p>
                      </div>
                    )}
                    {displayCase.crimeDetails.platformOrWebsite && (
                      <div className="info-item">
                        <p className="info-label">Platform/Website</p>
                        <p className="info-value">{displayCase.crimeDetails.platformOrWebsite}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Description - full width */}
                  {(displayCase.crimeDetails.description || displayCase.crimeType === 'Phishing') && (
                    <div className="description-container">
                      <p className="info-label">Description</p>
                      <p className="description-content">
                        {displayCase.crimeDetails.description || 
                         "A detailed description of the phishing attempt that occurred through email, claiming to be from a financial institution and requesting personal banking details."}
                      </p>
                    </div>
                  )}
                  
                  {/* Monetary Loss */}
                  {displayCase.crimeDetails.monetaryLoss && (
                    <div className="monetary-loss">
                      <p className="info-label">Monetary Loss</p>
                      <p className="info-value">
                        {displayCase.crimeDetails.monetaryLoss.currency || "USD"} {displayCase.crimeDetails.monetaryLoss.amount || "0.00"}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Case Timeline - simplified */}
                <div className="section">
                  <h3 className="section-title">Case Timeline</h3>
                  <ul className="timeline">
                    <li className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p className="timeline-title">Case Submitted</p>
                        <p className="timeline-date">{formatDate(displayCase.submittedAt)}</p>
                      </div>
                    </li>
                    <li className="timeline-item">
                      <div className="timeline-marker status-marker"></div>
                      <div className="timeline-content">
                        <p className="timeline-title">Status Updated to {displayCase.caseStatus}</p>
                        <p className="timeline-date">{formatDate(displayCase.submittedAt)}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card empty-state">
              <p>Select a case or search by Case ID to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCases;