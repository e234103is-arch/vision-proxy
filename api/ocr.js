export default async function handler(req, res) {

  // ★ここに書く
  console.log(
    "API KEY exists:",
    !!process.env.GOOGLE_VISION_API_KEY
  );

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image" });
  }

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

    const text =
      data.responses?.[0]?.fullTextAnnotation?.text || "";

    return res.status(200).json({ text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Vision API Error" });
  }
}
