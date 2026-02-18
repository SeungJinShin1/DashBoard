require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Use node-fetch for server-side fetch

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // For parsing application/json

// Proxy endpoint for Gemini API
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Get API key from server environment variables
  const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025"; // Can be dynamic or from env
  const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  if (!apiKey) {
    return res.status(500).json({ error: "Server API Key not configured." });
  }

  try {
    const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    res.status(500).json({ error: "Failed to communicate with Gemini API via proxy." });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
