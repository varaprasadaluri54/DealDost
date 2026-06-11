import { products as mockProducts } from '../data/products';

/**
 * Service to handle product data fetching from APIs.
 * Supports Google Custom Search API, Gemini AI Search, and fallback simulation.
 */
class ProductService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.cx = import.meta.env.VITE_GOOGLE_CSE_ID;
    this.isLiveEnabled = !!(this.apiKey && this.cx);
  }

  /**
   * Search for products across multiple stores.
   */
  async searchProducts(query, category = 'All') {
    console.log(`[ProductService] Searching for "${query}" in category "${category}"...`);

    // 1. Handle AI Search (prefixed with ai:)
    if (query.startsWith('ai:')) {
      return this.searchWithAI(query.replace(/^ai:/, ''), category);
    }

    // 2. Handle Real-time API via Backend Proxy (if configured)
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&cat=${category}`);
        if (response.ok) {
          console.info(`[ProductService] Successfully fetched data from ${API_BASE_URL}`);
          return await response.json();
        }
      } catch (error) {
        console.warn("[ProductService] Proxy API connection failed:", error);
      }
    }

    // 3. Handle Google Custom Search (if keys provided)
    if (this.isLiveEnabled && query) {
      try {
        const sites = 'site:amazon.in OR site:flipkart.com OR site:meesho.com OR site:myntra.com OR site:shopsy.in';
        const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.cx}&q=${encodeURIComponent(query + ' ' + sites)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          return this.transformGoogleResults(data.items || []);
        }
      } catch (error) {
        console.warn("[ProductService] Google CSE failed:", error);
      }
    }

    // 4. Fallback to Mock Data
    return this.getMockResults(query, category);
  }

  /**
   * Dedicated AI Search method
   */
  async searchWithAI(query, category) {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    if (!API_BASE_URL) {
      console.warn("VITE_API_URL not set. AI Search requires a backend proxy.");
      return this.getMockResults(query, category);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai-search?q=${encodeURIComponent(query)}&cat=${category}`);
      if (response.ok) return await response.json();
      throw new Error("AI Search API failed");
    } catch (error) {
      console.error("[ProductService] AI Search error:", error);
      return this.getMockResults(query, category);
    }
  }

  /**
   * Transforms Google CSE results into our application's product format
   */
  transformGoogleResults(items) {
    return items.map((item, index) => {
      const pagemap = item.pagemap || {};
      const product = pagemap.product?.[0] || {};
      const offer = pagemap.offer?.[0] || pagemap.offers?.[0] || {};
      const metatags = pagemap.metatags?.[0] || {};

      let price = offer.price || product.price || metatags['og:price:amount'] || "Price varies";
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.]/g, '')) || price;
      }

      const url = item.link;
      let store = "Store";
      if (url.includes('amazon')) store = "Amazon";
      else if (url.includes('flipkart')) store = "Flipkart";
      else if (url.includes('meesho')) store = "Meesho";
      else if (url.includes('myntra')) store = "Myntra";
      else if (url.includes('shopsy')) store = "Shopsy";

      return {
        id: `live-${index}`,
        name: product.name || item.title,
        image: pagemap.cse_image?.[0]?.src || pagemap.og_image?.[0]?.src || 'https://via.placeholder.com/300?text=Product',
        category: "Live Results",
        isLive: true,
        lastUpdated: new Date().toISOString(),
        prices: [
          {
            store: store,
            price: typeof price === 'number' ? price : 0,
            originalPrice: price,
            url: url,
            isLive: true
          }
        ]
      };
    });
  }

  /**
   * Mock result simulation with latency
   */
  async getMockResults(query, category) {
    const latency = Math.floor(Math.random() * 800) + 200;
    await new Promise(resolve => setTimeout(resolve, latency));

    let filtered = mockProducts;

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    return filtered.map(p => ({
      ...p,
      lastUpdated: new Date().toISOString(),
      isLive: false,
      prices: p.prices.map(pr => ({
        ...pr,
        price: Math.round(pr.price * (1 + (Math.random() * 0.02 - 0.01)))
      }))
    }));
  }
}

export const productService = new ProductService();
