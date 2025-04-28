import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './SpamChecker.css';
import toast from 'react-hot-toast';

const SpamChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to check if the text contains spam via the backend API
  const checkForSpam = async () => {
    if (!text) return;

    setLoading(true); // Show loading indicator
    setError(null); // Reset any previous errors
    setResult(null);

    try {
      const response = await axios.post('http://localhost:4000/api/spam-checker', {
        body: text,
      });

      if (response.data.data.success) {
        setResult(`Spam Score: ${response.data.data.score}`);
      } else {
        toast.error("Some error occurred!");
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while checking the text.');
    } finally {
      setLoading(false); // Hide loading indicator after request is complete
    }
  };

  return (
    <div className="spam-checker-container">
      <div className="header">
        <h1>Spam Text Checker</h1>
        <p>Paste an email message</p>
      </div>

      <div className="input-container">
        <textarea
          className="input-textarea"
          placeholder="Enter the text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      <div className="button-container">
        <button className="check-button" onClick={checkForSpam} disabled={loading}>
          {loading ? 'Checking...' : 'Check for Spam'}
        </button>
      </div>

      {result && (
        <div className="result-container">
          <p className="result-text">{result}</p>
          {/* Add a note explaining the Spam Score */}
          <p className="spam-score-note">
            <strong>Note:</strong> The higher the score, the higher the spam rating. A higher score indicates a higher likelihood that the message is spam.
          </p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SpamChecker;
