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
