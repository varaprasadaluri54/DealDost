/**
 * Utility to generate affiliate links for various stores
 * In a real application, you would have specific logic for each store's affiliate program
 */
export const getAffiliateLink = (url, store) => {
  /**
   * IMPORTANT: REPLACE THESE WITH YOUR PERSONAL AFFILIATE IDS
   * Get them from Amazon Associates India, Flipkart Affiliate Portal, etc.
   */
  const affiliateTags = {
    Amazon: "mytag-21",      // Your Amazon Associate Tag
    Flipkart: "affid-123",   // Your Flipkart Affiliate ID
    Myntra: "myntra-aff",    // Your Myntra/EarnKaro ID
    Meesho: "meesho-ref",
    Shopsy: "shopsy-ref",
    Nike: "nike-aff",
    Ajio: "ajio-aff",
    Croma: "croma-aff"
  };

  const tag = affiliateTags[store];
  if (!tag) return url;

  try {
    const urlObj = new URL(url);
    if (store === "Amazon") {
      urlObj.searchParams.set("tag", tag);
    } else {
      urlObj.searchParams.set("affid", tag); // Generic affiliate param for demo
    }
    return urlObj.toString();
  } catch {
    return url;
  }
};
