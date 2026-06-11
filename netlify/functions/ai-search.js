exports.handler = async (event) => {
  const { q } = event.queryStringParameters;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GEMINI_API_KEY is not configured." }),
    };
  }

  try {
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
    const textResponse = data.candidates[0].content.parts[0].text;
    const jsonMatch = textResponse.match(/\[.*\]/s);

    if (jsonMatch) {
      const products = JSON.parse(jsonMatch[0]);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products.map(p => ({ ...p, isLive: true, lastUpdated: new Date().toISOString() }))),
      };
    }
    throw new Error("Invalid AI Response");
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI search failed" }),
    };
  }
};
