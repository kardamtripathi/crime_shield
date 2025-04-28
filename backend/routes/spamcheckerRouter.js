import express from "express";
import axios from "axios";

const router = express.Router();

router.post('/', async (req, res) => {
    const { body} = req.body;

  // Validate if body and threshold are provided
  if (!body) {
    return res.status(400).json({ error: 'Body and threshold are required' });
  }

  const headers = {
    "apikey": process.env.API_LAYER_KEY
  };

  const payload = {
    email: body,
    options: "long"
  };

  try {
    // Make the POST request to the spam-checker API using Axios
    const response = await axios.post('https://spamcheck.postmarkapp.com/filter', payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
    
    // Return the result from the API
    return res.json({ data: response.data });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default router;