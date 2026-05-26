import { products as mockProducts } from '../data/products';

/**
 * Service to handle product data fetching from APIs.
 * Supports Google Custom Search API for real-time product search across Indian e-commerce sites.
 */
class ProductService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.cx = import.meta.env.VITE_GOOGLE_CSE_ID;
    this.isLiveEnabled = !!(this.apiKey && this.cx);
  }

  /**
   * Search for products across multiple stores.
   * If API keys are provided, it uses Google CSE to find real products.
   * Otherwise, it falls back to mock data.
   */
  async searchProducts(query, category = 'All') {
    if (!this.isLiveEnabled || !query) {
      return this.getMockResults(query, category);
    }

    try {
      // Search across specific domains for better relevance
      const sites = 'site:amazon.in OR site:flipkart.com OR site:meesho.com OR site:myntra.com OR site:shopsy.in';
      const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.cx}&q=${encodeURIComponent(query + ' ' + sites)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch live data');
      }

      const data = await response.json();
      return this.transformGoogleResults(data.items || [], query);
    } catch (error) {
      console.warn("Live fetch failed, falling back to mock data:", error.message);
      // Fallback to mock data on API error so the user still sees something
      return this.getMockResults(query, category);
    }
  }

  /**
   * Transforms Google CSE results into our application's product format
   */
  transformGoogleResults(items) {
    // Group results by "product name" or just return them as individual items
    // Since CSE returns pages, we try to extract product info from pagemaps
    return items.map((item, index) => {
      const pagemap = item.pagemap || {};
      const product = pagemap.product?.[0] || {};
      const offer = pagemap.offer?.[0] || pagemap.offers?.[0] || {};
      const metatags = pagemap.metatags?.[0] || {};

      // Extract price
      let price = offer.price || product.price || metatags['og:price:amount'] || "Price varies";
      if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.]/g, '')) || price;
      }

      // Extract store name from URL
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
            originalPrice: typeof price === 'number' ? price : price,
            url: url,
            isLive: true
          }
        ]
      };
    });
  }

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
