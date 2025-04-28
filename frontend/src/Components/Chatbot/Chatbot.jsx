import { useState, useEffect, useRef, useContext } from "react";
import "./Chatbot.css";
import axios from "axios";
import { Context } from "../../main";

const Chatbot = () => {
  const {isAuthorized} = useContext(Context);
  if(!isAuthorized){
    return;
  }
  const [messages, setMessages] = useState([
    { text: "Hello! I'm a Cybercrime AI Assistant. I can help with questions about cybersecurity, online fraud prevention, identity theft, data breaches, and other cybercrime topics. How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Send request to backend API endpoint that uses Google Gemini
      const response = await axios.post('http://localhost:4000/api/chatbot', { query: input }, {withCredentials: true});
      
      // Add bot response to chat
      const botResponse = { 
        text: response.data.response, 
        sender: "bot" 
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      const errorMessage = { 
        text: "Sorry, I encountered an error. Please try again later.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      {/* Chat container */}
      <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
        <div className="chatbot-header" style={{ backgroundColor: "#1a3a5f" }}>
          <h2 style={{ color: "#fff" }}>Cybercrime AI Assistant</h2>
          <button onClick={toggleChat} className="close-button">×</button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${msg.sender === "bot" ? "bot" : "user"}`}
            >
              {msg.sender === "bot" && (
                <div className="bot-avatar" style={{ backgroundColor: "#1a3a5f" }}>
                  🛡️
                </div>
              )}
              <div className="message-bubble">
                {msg.text}
              </div>
              {msg.sender === "user" && <div className="user-avatar">👤</div>}
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-message bot">
              <div className="bot-avatar" style={{ backgroundColor: "#1a3a5f" }}>
                🛡️
              </div>
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about cybersecurity..."
            className="chatbot-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            className={`chatbot-button ${isLoading ? 'disabled' : ''}`}
            style={{ backgroundColor: "#1a3a5f" }}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Toggle button */}
      <button 
        onClick={toggleChat} 
        className="chatbot-toggle"
        style={{ backgroundColor: "#1a3a5f" }}
      >
        <span className="bot-icon">🛡️</span>
      </button>
    </div>
  );
};

export default Chatbot;