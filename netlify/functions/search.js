exports.handler = async (event) => {
  const { q, cat } = event.queryStringParameters;

  try {
    // This replicates the logic from proxy.js but as a serverless function
    const simulatedApiResponse = [
      {
        id: Date.now(),
        name: `${q} - Results via Netlify Function`,
        category: cat || 'General',
        image: 'https://via.placeholder.com/300?text=Netlify+Result',
        prices: [
          { store: 'Amazon', price: 999, url: 'https://amazon.in' },
          { store: 'Flipkart', price: 1049, url: 'https://flipkart.com' }
        ],
        isLive: true,
        lastUpdated: new Date().toISOString()
      }
    ];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(simulatedApiResponse),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
