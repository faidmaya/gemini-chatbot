import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // tambahkan ini

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY; // Ambil API Key dari .env

// Ubah API_URL ke model yang valid
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Endpoint untuk mendapatkan respons dari Gemini AI
app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: req.body.message }] }],
      }),
    });

    const data = await response.json();
    console.log("📩 Respons dari Gemini:", data); // Log respons untuk debugging

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak ada respons 😅";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Gagal menghubungi Gemini API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

