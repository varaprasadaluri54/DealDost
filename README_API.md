# Integrating Real E-commerce APIs

This project is currently using a simulation of live price fetching. To move to a production environment with real live data from Amazon, Flipkart, etc., follow these steps:

## 1. Choose a Price Comparison API
Since most e-commerce sites (especially Amazon India) have strict scraping policies and protected APIs, it's recommended to use a third-party aggregator:

- **DataYuge**: Offers a specific API for Indian e-commerce price comparison.
- **Apify / Bright Data**: Useful for custom scraping tasks if official APIs are restricted.
- **PriceAPI / Rainforest API**: Specialized in Amazon and other global marketplaces.

## 2. Implement a Backend Proxy
**Critical**: Do not call e-commerce APIs directly from the frontend (React).
- **CORS Issues**: Browser security will block direct requests to Amazon/Flipkart.
- **Security**: Your API keys would be exposed in the frontend code.
- **Affiliate Tagging**: A backend can more securely append and track affiliate performance.

Example Node.js/Express Proxy:
```javascript
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  const response = await fetch(`https://api.datayuge.com/v1/search?q=${q}&apikey=${process.env.API_KEY}`);
  const data = await response.json();
  res.json(data);
});
```

## 3. Update ProductService.js
Once your backend is ready, update `src/services/productService.js`:
```javascript
async searchProducts(query, category) {
  const response = await fetch(`/api/search?q=${query}&cat=${category}`);
  if (!response.ok) throw new Error('API request failed');
  return await response.json();
}
```

## 4. Handle Affiliate Links
Ensure your affiliate IDs are registered with:
- [Amazon Associates India](https://affiliate-program.amazon.in/)
- [Flipkart Affiliate Program](https://affiliate.flipkart.com/)
- [EarnKaro / Curofit](https://earnkaro.com/) (Useful for multi-store management in India)
