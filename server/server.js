require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the Gemini SDK
// It automatically picks up GEMINI_API_KEY from the environment file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required.' });
    }

    // Call Gemini to summarize the content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize this in 3 bullet points, identify key insights, and estimate reading time (assume 200 words per minute):\n\n${text}`,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate summary from AI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});