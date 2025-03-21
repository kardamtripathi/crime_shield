import { catchAsyncErrors } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyAHknov2Y1Vkm8hN8jGrvCNKzGsEBr-IGA";

export const getChatbotResponse = catchAsyncErrors(async (req, res, next) => {
  const { query } = req.body;
  
  if (!query) {
    return next(new ErrorHandler('Query is required', 400));
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a specialized prompt that instructs the model to act as a cybercrime assistant
    const specializedPrompt = `
    You are a specialized Cybercrime AI Assistant. You only respond to queries related to:
    - Cybersecurity
    - Digital forensics
    - Online scams and fraud prevention
    - Identity theft protection
    - Data breaches
    - Cyber attacks
    - Internet safety
    - Digital crime prevention
    - Security best practices
    - Privacy protection
    
    If the query is not related to cybercrime or cybersecurity, politely inform the user that you're 
    specialized in cybercrime-related topics and ask them to provide a relevant question.
    
    User query: ${query}
    `;
    
    const result = await model.generateContent(specializedPrompt);
    const response = result.response.text();
    
    res.status(200).json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Error in Google AI API:', error);
    return next(new ErrorHandler('Failed to get AI response', 500));
  }
});