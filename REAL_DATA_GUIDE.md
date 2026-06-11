# Getting Real E-commerce Data (Free Method)

This project uses **Google Custom Search API (CSE)** to fetch real product data from Amazon, Flipkart, Meesho, Myntra, and Shopsy. This is a 100% free method that works directly from the frontend (no backend required).

## Setup Instructions

To enable live data, you need to get your own free API keys from Google.

### 1. Get a Google API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "DealDost").
3. Go to **APIs & Services > Library**.
4. Search for **"Custom Search API"** and click **Enable**.
5. Go to **APIs & Services > Credentials**.
6. Click **Create Credentials > API Key**.
7. Copy this key.

### 2. Get a Search Engine ID (CX)
1. Go to the [Programmable Search Engine](https://programmablesearchengine.google.com/).
2. Click **Add**.
3. Name your search engine (e.g., "DealDost Shopping").
4. Under "What to search?", select **"Search specific sites"** and add these:
   - `amazon.in`
   - `flipkart.com`
   - `meesho.com`
   - `myntra.com`
   - `shopsy.in`
5. Click **Create**.
6. Go to **Customize > Basic** and find the **Search engine ID**.
7. Copy this ID.

### 3. Update your Environment Variables
1. Create a file named `.env` in the root directory of this project.
2. Add your keys like this:

```env
VITE_GOOGLE_API_KEY=your_copied_api_key
VITE_GOOGLE_CSE_ID=your_copied_search_engine_id
```

3. Restart your development server (`npm run dev`).

## How it works
- **No Backend**: The app calls the Google API directly from your browser.
- **Bypasses CORS**: Google's API is designed for frontend use, so you won't face CORS issues that happen when scraping Amazon directly.
- **100 Free Searches/Day**: Google provides 100 free searches per day. This fits your requirement of 50-100 products.
- **Fallback**: If you don't provide API keys, or if you exceed the limit, the app automatically falls back to the high-quality simulated data in `src/data/products.js`.

## Limitations
- **Data Freshness**: Google's index might be a few hours or days old, so prices might slightly differ from the live site.
- **Search Results**: It returns the most relevant pages. The app tries to extract price and image information from the metadata (Schema.org) of those pages.
# Guide: Getting Real Product Data from Shopping Sites

To show live data from sites like Amazon, Flipkart, and Myntra in DealDost, follow this architecture.

## 🚀 Quick Checklist: Required Keys
To go live, you need to collect these three types of keys:

1.  **Product Data API Key:** (Choose one)
    *   **DataYuge:** Most popular for Indian stores.
    *   **Rainforest:** Best for global Amazon data.
    *   **RapidAPI:** Good for general e-commerce scrapers.
2.  **Affiliate Tracking IDs:**
    *   **Amazon Associates ID:** (e.g., `yoursite-21`)
    *   **Flipkart Affiliate ID:** (e.g., `affid-789`)
3.  **Backend URL:** (Internal)
    *   `VITE_API_URL`: Points your React app to your proxy server.

---

## 1. How the data is fetched
You cannot call Amazon directly from React. You must use a **Middleman API** that scrapes the data for you.

### Recommended APIs for India:
- **DataYuge API:** Best for Indian e-commerce (Flipkart, Amazon.in, etc.).
- **RapidAPI (Amazon Price Scraper):** Good for quick global Amazon data.
- **Rainforest API:** Specifically for Amazon.

## 2. Integration Steps

### Step A: Get an API Key
Go to [DataYuge](https://datayuge.com/) or [RapidAPI](https://rapidapi.com/) and sign up for a free/basic tier key.

### Step B: The CORS Problem (Important)
Since you don't have a backend (BE), you have two choices:

1. **Proxy Service (Easiest for testing):**
   You can use `https://cors-anywhere.herokuapp.com/` as a prefix to your API URL to bypass browser security.
   *Example:* `fetch('https://cors-anywhere.herokuapp.com/https://api.datayuge.com/...')`

2. **Serverless Functions (Best for production):**
   If you deploy on **Vercel** or **Netlify**, you can create a simple file in a `/api` folder. They act as a "mini-backend" for free.

## 3. Mapping Data
The data you get from a real API will look different from our mock data. You must "map" it in `src/services/productService.js`.

**Example Mapping:**
```javascript
const mapApiToDealDost = (apiResult) => {
  return {
    id: apiResult.product_id,
    name: apiResult.product_name,
    image: apiResult.product_image,
    category: "Fashion",
    prices: [
      { store: "Amazon", price: apiResult.amazon_price, url: apiResult.amazon_link },
      { store: "Flipkart", price: apiResult.flipkart_price, url: apiResult.flipkart_link }
    ]
  };
};
```

## 4. Current Status
The code in `src/services/productService.js` now contains a placeholder method `fetchFromRealAPI`. Once you have your API key, simply paste it there!
