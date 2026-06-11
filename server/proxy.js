/**
 * DealDost Backend Proxy
 * This server acts as a bridge between the React frontend and 3rd party e-commerce APIs.
 * It prevents CORS issues and keeps your API keys secure.
 */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example endpoint for searching products via DataYuge or similar
app.get('/api/search', async (req, res) => {
  const { q, cat } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    console.log(`[Proxy] Fetching data for: ${q}`);

    // Replace this with a real API like DataYuge, Rainforest, etc.
    // const API_KEY = process.env.DATAYUGE_API_KEY;
    // const response = await fetch(`https://api.datayuge.com/v1/search?q=${q}&apikey=${API_KEY}`);
    // const data = await response.json();

    // For now, we simulate a successful API response structure
    const simulatedApiResponse = [
      {
        id: Date.now(),
        name: `${q} - Genuine Product`,
        category: cat || 'General',
        image: 'https://via.placeholder.com/150',
        prices: [
          { store: 'Amazon', price: 999, url: 'https://amazon.in' },
          { store: 'Flipkart', price: 1049, url: 'https://flipkart.com' }
        ],
        isLive: true,
        lastUpdated: new Date().toISOString()
      }
    ];

    res.json(simulatedApiResponse);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from e-commerce stores' });
  }
});

/**
 * AI Search Endpoint (using Google Gemini)
 * This uses AI to "find" products and return them in our standard format.
 */
app.get('/api/ai-search', async (req, res) => {
  const { q } = req.query;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    console.log(`[AI Proxy] Researching products for: ${q}`);

    const prompt = `You are a shopping assistant. Find 3 real products matching "${q}" available in India (Amazon.in, Flipkart).
    Return ONLY a JSON array with this structure:
    [{ "id": number, "name": "string", "image": "string", "category": "string", "prices": [{ "store": "string", "price": number, "url": "string" }] }]`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    // Simple extraction logic for Gemini's text response
    const textResponse = data.candidates[0].content.parts[0].text;
    const jsonMatch = textResponse.match(/\[.*\]/s);

    if (jsonMatch) {
      const products = JSON.parse(jsonMatch[0]);
      res.json(products.map(p => ({ ...p, isLive: true, lastUpdated: new Date().toISOString() })));
    } else {
      throw new Error("AI failed to return valid JSON");
    }
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({ error: 'AI research failed. Try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 DealDost Proxy running at http://localhost:${PORT}`);
});
