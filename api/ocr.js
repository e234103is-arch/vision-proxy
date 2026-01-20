export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "No image" });
  }

  // 環境変数確認（ログで見える）
  console.log("API KEY exists:", !!process.env.GOOGLE_VISION_API_KEY);

  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: image },
              features: [{ type: "TEXT_DETECTION" }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Vision API error" });
  }
}
