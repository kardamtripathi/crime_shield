import React, { useState, useEffect } from "react";
import "../../App.css";

const SimpleCaptcha = ({ onVerifyChange })  => {
  const [captcha, setCaptcha] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newCaptcha = "";
    for (let i = 0; i < 6; i++) {
      newCaptcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(newCaptcha);
    setInputValue("");
    setIsVerified(false);
    onVerifyChange(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (inputValue.trim().toUpperCase() === captcha) {
      setIsVerified(true);
      onVerifyChange(true); 
    } else {
      setIsVerified(false);
      onVerifyChange(false);
      generateCaptcha();
      alert("Captcha Incorrect! Try again.");
    }
  };

  return (
    <div className="captcha-container">
        <div className="upper-captcha-section">
        <div className="captcha-foreground">
          {captcha}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Captcha"
          className="captcha-input"
        />
        </div>
        <div className="lower-captcha-section">
        <button type="button" onClick={handleVerify} className="captcha-button">
            Verify
        </button>
        <button type="button" onClick={generateCaptcha} className="refresh-button">
            Refresh
        </button>
        
        </div>
        {isVerified && (
          <div className="captcha-success-message">
            Captcha Verified Successfully ✅
          </div>
        )}
    </div>
  );
};

export default SimpleCaptcha;
