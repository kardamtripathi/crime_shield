import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CyberCrimeReporting.css';

const CyberCrimeForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    idProofType: 'National ID',
    idProofNumber: '',
    crimeType: '',
    subCategory: '',
    crimeDateTime: '',
    location: '',
    platformOrWebsite: '',
    suspectName: '',
    suspectContactInfo: '',
    suspectIpAddress: '',
    suspectOtherDetails: '',
    description: '',
    monetaryLossAmount: '',
    monetaryLossCurrency: 'USD',
    evidenceDescription: '',
  });

  const [attachments, setAttachments] = useState([]);

  const crimeTypes = [
    "Phishing",
    "Identity Theft",
    "Online Harassment",
    "Hacking",
    "Ransomware Attack",
    "Credit Card Fraud",
    "Data Breach",
    "Online Scam", 
    "Cyber Stalking",
    "Unauthorized Access",
    "Child Exploitation",
    "Intellectual Property Theft",
    "Cryptocurrency Fraud",
    "Social Media Impersonation",
    "Other"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 5) {
      setMessage({
        text: 'Maximum 5 files can be uploaded',
        type: 'error'
      });
      return;
    }
    
    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const invalidFiles = files.filter(file => 
      !validTypes.includes(file.type) || file.size > maxSize
    );
    
    if (invalidFiles.length > 0) {
      setMessage({
        text: 'Some files are invalid. Only JPG, PNG, PDF, DOC, DOCX, and TXT files under 10MB are allowed.',
        type: 'error'
      });
      return;
    }
    
    setAttachments([...attachments, ...files]);
  };

  const removeFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Create form data object
      const data = new FormData();
      
      // Add personal information
      data.append('name', formData.name);
      data.append('mobile', formData.mobile);
      data.append('email', formData.email);
      
      // Add address as JSON object
      const address = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };
      data.append('address', JSON.stringify(address));
      
      // Add ID proof information
      data.append('idProofType', formData.idProofType);
      data.append('idProofNumber', formData.idProofNumber);
      
      // Add crime details
      data.append('crimeType', formData.crimeType);
      data.append('subCategory', formData.subCategory);
      data.append('crimeDateTime', formData.crimeDateTime);
      data.append('location', formData.location);
      data.append('platformOrWebsite', formData.platformOrWebsite);
      
      // Add suspect info as JSON object
      const suspectInfo = {
        name: formData.suspectName,
        contactInfo: formData.suspectContactInfo,
        ipAddress: formData.suspectIpAddress,
        otherDetails: formData.suspectOtherDetails
      };
      data.append('suspectInfo', JSON.stringify(suspectInfo));
      
      data.append('description', formData.description);
      
      // Add monetary loss as JSON object
      const monetaryLoss = {
        amount: parseFloat(formData.monetaryLossAmount) || 0,
        currency: formData.monetaryLossCurrency
      };
      data.append('monetaryLoss', JSON.stringify(monetaryLoss));
      
      data.append('evidenceDescription', formData.evidenceDescription);
      
      // Add file attachments
      attachments.forEach(file => {
        data.append('attachments', file);
      });

      // Submit the form
      const response = await axios.post('http://localhost:4000/api/cybercrime/submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setMessage({
        text: `Case submitted successfully. Your case ID is: ${response.data.caseId}`,
        type: 'success'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        mobile: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        idProofType: 'National ID',
        idProofNumber: '',
        crimeType: '',
        subCategory: '',
        crimeDateTime: '',
        location: '',
        platformOrWebsite: '',
        suspectName: '',
        suspectContactInfo: '',
        suspectIpAddress: '',
        suspectOtherDetails: '',
        description: '',
        monetaryLossAmount: '',
        monetaryLossCurrency: 'USD',
        evidenceDescription: '',
      });
      setAttachments([]);
      
      // Redirect to success page or case details
      setTimeout(() => {
        navigate(`/cases`);
      }, 3000);
      
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'An error occurred while submitting your case',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cybercrime-form-container">
      <div className="form-header">
        <h1>Cyber Crime Reporting Form</h1>
        <p>Please fill in all the details to report a cyber crime incident</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="cybercrime-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit mobile number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <h3>Address</h3>
          <div className="form-group">
            <label htmlFor="street">Street Address *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP/Postal Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <h3>Identification</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="idProofType">ID Proof Type *</label>
              <select
                id="idProofType"
                name="idProofType"
                value={formData.idProofType}
                onChange={handleInputChange}
                required
              >
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="National ID">National ID</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="idProofNumber">ID Number *</label>
              <input
                type="text"
                id="idProofNumber"
                name="idProofNumber"
                value={formData.idProofNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Crime Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="crimeType">Type of Cyber Crime *</label>
              <select
                id="crimeType"
                name="crimeType"
                value={formData.crimeType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Crime Type</option>
                {crimeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subCategory">Sub-category (if applicable)</label>
              <input
                type="text"
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="crimeDateTime">Date and Time of Incident *</label>
              <input
                type="datetime-local"
                id="crimeDateTime"
                name="crimeDateTime"
                value={formData.crimeDateTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Physical Location During Incident *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Home, Office, etc."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="platformOrWebsite">Platform or Website Involved</label>
            <input
              type="text"
              id="platformOrWebsite"
              name="platformOrWebsite"
              value={formData.platformOrWebsite}
              onChange={handleInputChange}
              placeholder="e.g., Facebook, Gmail, Online Banking Site, etc."
            />
          </div>

          <h3>Suspect Information (if available)</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="suspectName">Suspect Name</label>
              <input
                type="text"
                id="suspectName"
                name="suspectName"
                value={formData.suspectName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="suspectContactInfo">Suspect Contact Information</label>
              <input
                type="text"
                id="suspectContactInfo"
                name="suspectContactInfo"
                value={formData.suspectContactInfo}
                onChange={handleInputChange}
                placeholder="Email, Phone, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="suspectIpAddress">IP Address (if known)</label>
              <input
                type="text"
                id="suspectIpAddress"
                name="suspectIpAddress"
                value={formData.suspectIpAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="suspectOtherDetails">Other Suspect Details</label>
              <input
                type="text"
                id="suspectOtherDetails"
                name="suspectOtherDetails"
                value={formData.suspectOtherDetails}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description of the Incident *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              minLength={50}
              rows={5}
              placeholder="Please provide a detailed account of what happened..."
            ></textarea>
          </div>

          <h3>Financial Impact</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monetaryLossAmount">Amount Lost (if applicable)</label>
              <input
                type="number"
                id="monetaryLossAmount"
                name="monetaryLossAmount"
                value={formData.monetaryLossAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="monetaryLossCurrency">Currency</label>
              <select
                id="monetaryLossCurrency"
                name="monetaryLossCurrency"
                value={formData.monetaryLossCurrency}
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="evidenceDescription">Description of Evidence</label>
            <textarea
              id="evidenceDescription"
              name="evidenceDescription"
              value={formData.evidenceDescription}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe any evidence you have (screenshots, emails, messages, etc.)"
            ></textarea>
          </div>

          <div className="form-group file-upload">
            <label>File Attachments (Max 5 files, 10MB each)</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="fileAttachments"
                onChange={handleFileChange}
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                className="file-input"
              />
              <label htmlFor="fileAttachments" className="file-label">
                <i className="fas fa-cloud-upload-alt"></i> Choose Files
              </label>
            </div>
            <small>Accepted formats: JPG, PNG, PDF, DOC, DOCX, TXT</small>
            
            {attachments.length > 0 && (
              <div className="file-list">
                <h4>Selected Files:</h4>
                <ul>
                  {attachments.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      <button 
                        type="button" 
                        className="remove-file" 
                        onClick={() => removeFile(index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CyberCrimeForm;