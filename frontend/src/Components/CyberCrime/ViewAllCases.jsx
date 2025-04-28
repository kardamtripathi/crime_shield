import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllCases.css';

const ViewAllCases = () => {
  // State management
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedPriority, setUpdatedPriority] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('All');
  const [timeframeFilter, setTimeframeFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  
  // Options for dropdowns
  const statusOptions = ['Submitted', 'Under Review', 'Investigation', 'Resolved', 'Closed', 'Rejected'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const crimeTypeOptions = ['Phishing', 'Identity Theft', 'Data Breach', 'Ransomware', 'Online Fraud', 'Cyber Stalking', 'Hacking'];
  const timeframeOptions = ['All', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priorityHigh', label: 'Priority (High to Low)' },
    { value: 'priorityLow', label: 'Priority (Low to High)' },
  ];

  // Fetch cases on component mount
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/cybercrime/all', {
          withCredentials: true
        });
        
        if (response.data.success) {
          const fetchedCases = response.data.cases || [];
          setCases(fetchedCases);
          setFilteredCases(fetchedCases);
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

  // Initialize edit form values when a case is selected
  useEffect(() => {
    if (selectedCase) {
      setUpdatedStatus(selectedCase.caseStatus);
      setUpdatedPriority(selectedCase.priority);
    }
  }, [selectedCase]);

  // Apply filters and sorting
  useEffect(() => {
    if (!cases.length) return;
    
    let result = [...cases];
    
    // Apply filters
    if (statusFilter !== 'All') {
      result = result.filter(c => c.caseStatus === statusFilter);
    }
    
    if (priorityFilter !== 'All') {
      result = result.filter(c => c.priority === priorityFilter);
    }
    
    if (crimeTypeFilter !== 'All') {
      result = result.filter(c => c.crimeDetails.crimeType === crimeTypeFilter);
    }
    
    if (timeframeFilter !== 'All') {
      const now = new Date();
      let cutoffDate;
      
      switch (timeframeFilter) {
        case 'Today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'Last 7 Days':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          cutoffDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'Last 90 Days':
          cutoffDate = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        result = result.filter(c => new Date(c.submittedAt) >= cutoffDate);
      }
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
        break;
      case 'priorityHigh':
        const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'priorityLow':
        const priorityOrderReverse = { 'Low': 0, 'Medium': 1, 'High': 2, 'Urgent': 3 };
        result.sort((a, b) => priorityOrderReverse[a.priority] - priorityOrderReverse[b.priority]);
        break;
      case 'caseIdAsc':
        result.sort((a, b) => a.caseId.localeCompare(b.caseId));
        break;
      case 'caseIdDesc':
        result.sort((a, b) => b.caseId.localeCompare(a.caseId));
        break;
      default:
        break;
    }
    
    setFilteredCases(result);
    
  }, [cases, statusFilter, priorityFilter, crimeTypeFilter, timeframeFilter, sortOption, selectedCase]);

  const handleViewCase = async (caseId) => {
    if (!caseId.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/cybercrime/${caseId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSelectedCase(response.data.case);
        setIsEditing(false);
        setUpdateSuccess(false);
      } else {
        setError(response.data.message || 'Failed to fetch case details');
        setSelectedCase(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
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

  const handleUpdateCase = async (e) => {
    e.preventDefault();
    
    if (!selectedCase) return;
    
    try {
      setUpdateLoading(true);
      
      const updateData = {
        caseStatus: updatedStatus,
        priority: updatedPriority
      };
      
      const response = await axios.post(
        `http://localhost:4000/api/cybercrime/update/${selectedCase.caseId}`,
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update local state
        const updatedCase = { ...selectedCase, ...updateData };
        setSelectedCase(updatedCase);
        
        // Update the case in the list
        setCases(prevCases => 
          prevCases.map(c => 
            c.caseId === selectedCase.caseId ? updatedCase : c
          )
        );
        
        setUpdateSuccess(true);
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to update case');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to server');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setCrimeTypeFilter('All');
    setTimeframeFilter('All');
    setSortOption('newest');
    setSelectedCase(null);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="cases-container">
      <h1 className="main-title">Cyber Crime Case Management</h1>
      
      {/* Inline Filters and Sort */}
      <div className="inline-filters-container card">
        <div className="inline-filters-header">
          <h2>Filters and Sort</h2>
          <button className="reset-filters-button" onClick={handleResetFilters}>
            Reset
          </button>
        </div>
        
        <div className="inline-filters-content">
          <div className="inline-filter-group">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="inline-filter-group">
            <label htmlFor="priorityFilter">Priority:</label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          
          <div className="inline-filter-group">
            <label htmlFor="crimeTypeFilter">Type:</label>
            <select
              id="crimeTypeFilter"
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              {crimeTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="inline-filter-group">
            <label htmlFor="timeframeFilter">Time:</label>
            <select
              id="timeframeFilter"
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value)}
            >
              {timeframeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="inline-filter-group">
            <label htmlFor="sortOption">Sort:</label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
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
      
      {/* Success message */}
      {updateSuccess && (
        <div className="success-message">
          <p>Case updated successfully!</p>
        </div>
      )}
      
      <div className="grid-container">
        {/* Cases List */}
        <div className="cases-list-container">
          <div className="card">
            <div className="card-header">
              <h2>Recent Cases</h2>
            </div>
            {loading && !filteredCases.length ? (
              <div className="loading-message">Loading cases...</div>
            ) : !filteredCases.length ? (
              <div className="empty-message">No cases found</div>
            ) : (
              <ul className="cases-list">
                {filteredCases.map((caseItem) => (
                  <li 
                    key={caseItem.caseId} 
                    className={`case-item ${selectedCase && selectedCase.caseId === caseItem.caseId ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCase(caseItem);
                      setSearchId(caseItem.caseId);
                      setIsEditing(false);
                      setUpdateSuccess(false);
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
          ) : selectedCase ? (
            <div className="card">
              <div className="case-detail-header">
                <div className="case-header-content">
                  <h2 className="case-detail-id">Case: {selectedCase.caseId}</h2>
                  <div className="case-header-badges">
                    <span className={`badge priority-${selectedCase.priority.toLowerCase()}`}>
                      {selectedCase.priority}
                    </span>
                    <span className={`badge status-${selectedCase.caseStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                      {selectedCase.caseStatus}
                    </span>
                  </div>
                </div>
                <div className="case-header-actions">
                  {!isEditing ? (
                    <button 
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Status
                    </button>
                  ) : (
                    <button 
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              
              {/* Status Edit Form */}
              {isEditing && (
                <div className="edit-status-form">
                  <form onSubmit={handleUpdateCase}>
                    <div className="form-group">
                      <label htmlFor="status">Case Status:</label>
                      <select
                        id="status"
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                        required
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="priority">Priority:</label>
                      <select
                        id="priority"
                        value={updatedPriority}
                        onChange={(e) => setUpdatedPriority(e.target.value)}
                        required
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-buttons">
                      <button 
                        type="submit" 
                        className="update-button"
                        disabled={updateLoading}
                      >
                        {updateLoading ? 'Updating...' : 'Update Case'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="case-detail-content">
                {/* Complainant Information */}
                <div className="section">
                  <h3 className="section-title">Complainant Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <p className="info-label">Name</p>
                      <p className="info-value">{selectedCase.complainant.name}</p>
                    </div>
                    {selectedCase.complainant.email && (
                      <div className="info-item">
                        <p className="info-label">Email</p>
                        <p className="info-value">{selectedCase.complainant.email}</p>
                      </div>
                    )}
                    {selectedCase.complainant.mobile && (
                      <div className="info-item">
                        <p className="info-label">Mobile</p>
                        <p className="info-value">{selectedCase.complainant.mobile}</p>
                      </div>
                    )}
                    {selectedCase.complainant.idProofType && (
                      <div className="info-item">
                        <p className="info-label">ID Type</p>
                        <p className="info-value">{selectedCase.complainant.idProofType}</p>
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
                      <p className="info-value">{selectedCase.crimeDetails.crimeType}</p>
                    </div>
                    {selectedCase.crimeDetails.subCategory && (
                      <div className="info-item">
                        <p className="info-label">Sub-Category</p>
                        <p className="info-value">{selectedCase.crimeDetails.subCategory}</p>
                      </div>
                    )}
                    <div className="info-item">
                      <p className="info-label">Date & Time</p>
                      <p className="info-value">{formatDate(selectedCase.crimeDetails.crimeDateTime)}</p>
                    </div>
                    {selectedCase.crimeDetails.location && (
                      <div className="info-item">
                        <p className="info-label">Location</p>
                        <p className="info-value">{selectedCase.crimeDetails.location}</p>
                      </div>
                    )}
                    {selectedCase.crimeDetails.platformOrWebsite && (
                      <div className="info-item">
                        <p className="info-label">Platform/Website</p>
                        <p className="info-value">{selectedCase.crimeDetails.platformOrWebsite}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Description - full width */}
                  {selectedCase.crimeDetails.description && (
                    <div className="description-container">
                      <p className="info-label">Description</p>
                      <p className="description-content">{selectedCase.crimeDetails.description}</p>
                    </div>
                  )}
                  
                  {/* Monetary Loss */}
                  {selectedCase.crimeDetails.monetaryLoss && (
                    <div className="monetary-loss">
                      <p className="info-label">Monetary Loss</p>
                      <p className="info-value">
                        {selectedCase.crimeDetails.monetaryLoss.currency} {selectedCase.crimeDetails.monetaryLoss.amount}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Case Timeline */}
                <div className="section">
                  <h3 className="section-title">Case Timeline</h3>
                  <ul className="timeline">
                    <li className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p className="timeline-title">Case Submitted</p>
                        <p className="timeline-date">{formatDate(selectedCase.submittedAt)}</p>
                      </div>
                    </li>
                    {selectedCase.lastUpdatedAt && (
                      <li className="timeline-item">
                        <div className="timeline-marker status-marker"></div>
                        <div className="timeline-content">
                          <p className="timeline-title">Status Updated to {selectedCase.caseStatus}</p>
                          <p className="timeline-date">{formatDate(selectedCase.lastUpdatedAt)}</p>
                        </div>
                      </li>
                    )}
                    {selectedCase.statusUpdates && selectedCase.statusUpdates.map((update, index) => (
                      <li key={index} className="timeline-item">
                        <div className="timeline-marker status-marker"></div>
                        <div className="timeline-content">
                          <p className="timeline-title">Status Updated to {update.status}</p>
                          <p className="timeline-date">{formatDate(update.updatedAt)}</p>
                          {update.notes && <p className="timeline-notes">{update.notes}</p>}
                          {update.updatedBy && <p className="timeline-officer">By: {update.updatedBy}</p>}
                        </div>
                      </li>
                    ))}
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

export default ViewAllCases;