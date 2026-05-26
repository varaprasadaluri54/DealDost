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
    // Simulate network latency (500ms - 1500ms)
    const latency = Math.floor(Math.random() * 1000) + 500;
    await new Promise(resolve => setTimeout(resolve, latency));

    try {
      // Logic for "Live" fetching simulation
      // In production, you would use: 
      // const response = await fetch(`https://api.pricecheck.com/search?q=${query}&cat=${category}`);
      // return await response.json();

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
      throw new Error("Could not retrieve live price data. Please try again later.");
    }
  }
}

export const productService = new ProductService();
