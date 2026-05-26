import { products as mockProducts } from '../data/products';

/**
 * Service to handle product data fetching from APIs.
 * Currently simulates "live" fetching with mock data and latency.
 */
class ProductService {
  /**
   * Search for products across multiple stores.
   * In a real implementation, this would call a backend API that scrapes or uses official APIs.
   */
  async searchProducts(query, category = 'All') {
    console.log(`[ProductService] Searching for "${query}" in category "${category}"...`);

    // Check if an API URL is configured (e.g., in a .env file)
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&cat=${category}`);
        if (response.ok) {
          return await response.json();
        }
        console.warn(`API responded with status: ${response.status}. Falling back to mock data.`);
      } catch (error) {
        console.warn("Live API connection failed. Falling back to mock data simulation:", error);
      }
    }

    /**
     * REAL-WORLD EXAMPLE: Using a 3rd Party API (e.g., DataYuge)
     * To use this, you would uncomment the block below and provide your API Key.
     */
    /*
    const DATA_YUGE_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
    try {
      const response = await fetch(`https://api.datayuge.com/v1/compare/search?q=${query}&api_key=${DATA_YUGE_KEY}`);
      const data = await response.json();

      // Transform their specific format into DealDost format
      return data.products.map(p => ({
        id: p.product_id,
        name: p.product_title,
        image: p.product_image,
        category: category,
        isLive: true,
        lastUpdated: new Date().toISOString(),
        prices: [
          { store: 'Amazon', price: p.amazon_price, url: p.amazon_link },
          { store: 'Flipkart', price: p.flipkart_price, url: p.flipkart_link }
        ]
      }));
    } catch (e) {
      console.log("External API failed, using simulation...");
    }
    */

    // Simulation Fallback Logic
    const latency = Math.floor(Math.random() * 800) + 400;
    await new Promise(resolve => setTimeout(resolve, latency));

    try {
      let filtered = mockProducts;
      
      if (query) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
      }

      // Add "live" metadata
      return filtered.map(p => ({
        ...p,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        // Simulate slight price fluctuations for "live" feel
        prices: p.prices.map(pr => ({
          ...pr,
          price: Math.round(pr.price * (1 + (Math.random() * 0.02 - 0.01))) // +/- 1% variation
        }))
      }));
    } catch (error) {
      console.error("Failed to fetch live prices:", error);
      throw new Error("Could not retrieve live price data. Please try again later.", { cause: error });
    }
  }
}

export const productService = new ProductService();
