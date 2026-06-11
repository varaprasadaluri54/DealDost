/**
 * DealDost Backend Proxy
 * This server acts as a bridge between the React frontend and 3rd party e-commerce APIs.
 * It prevents CORS issues and keeps your API keys secure.
 */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';

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
/**
 * NO-KEY SCRAPER (Experimental)
 * This fetches a page directly and parses the HTML using Cheerio.
 * NOTE: Large sites like Amazon will block this without high-quality proxies/headers.
 */
app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  // SECURITY: Whitelist allowed shopping domains to prevent SSRF
  const allowedDomains = ['amazon.in', 'flipkart.com', 'meesho.com', 'myntra.com', 'shopsy.in', 'bata.in'];
  try {
    const urlObj = new URL(url);
    if (!allowedDomains.some(domain => urlObj.hostname.endsWith(domain))) {
      return res.status(403).json({ error: 'Domain not allowed for scraping.' });
    }

    console.log(`[Scraper] Attempting to read: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // This is an example of how you "pick" data from a website
    // Each site has different CSS classes, so this logic must be custom for each!
    const product = {
      name: $('h1').first().text().trim() || 'Scraped Product',
      price: $('.a-price-whole').first().text().trim() || 'Unknown',
      image: $('img').first().attr('src'),
      url: url,
      isLive: true,
      lastUpdated: new Date().toISOString()
    };

    res.json(product);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

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

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_KEY
      },
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
