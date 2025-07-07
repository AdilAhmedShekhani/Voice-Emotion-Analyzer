require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

console.log("HF KEY Check:", process.env.HF_API_KEY ?.slice(0, 10));

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const emotions = response.data[0];
    const topEmotion = emotions.reduce((max, curr) =>
      curr.score > max.score ? curr : max
    );

    res.json({ emotion: topEmotion.label });
  } catch (err) {
    console.error("HuggingFace API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze emotion" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
