export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL = "gemini-3-flash-preview";
  const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  if (!apiKey) {
    return res.status(500).json({ error: "Server API Key not configured." });
  }

  try {
    const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini API Proxy Error:", error);
    res.status(500).json({ error: "Failed to communicate with Gemini API." });
  }
}
