const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 PUT YOUR REAL TOKEN HERE
const ACCESS_TOKEN = "YOUR_REAL_INSTAGRAM_TOKEN";

// ✅ Instagram URL validation
const instagramRegex =
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_\-]+\/?/;

// ─────────────────────────────────────────
// FETCH INSTAGRAM DATA
// ─────────────────────────────────────────
async function fetchInstagramData(url) {
  try {
    const apiUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(
      url
    )}&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("📦 API RESPONSE:", data);

    if (data.error) {
      console.log("❌ API ERROR:", data.error.message);
      return null;
    }

    return {
      image: data.thumbnail_url || "",
      username: data.author_name || "instagram_user",
      embed_html: data.html || "",
    };
  } catch (err) {
    console.log("❌ Fetch error:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────
// GET ALL LINKS
// ─────────────────────────────────────────
app.get("/links", (req, res) => {
  db.query("SELECT * FROM instagram_links ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ─────────────────────────────────────────
// ADD LINK
// ─────────────────────────────────────────
app.post("/links", async (req, res) => {
  const { url, published } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });
  if (!instagramRegex.test(url)) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  const instagramData = await fetchInstagramData(url);

  if (!instagramData) {
    return res.status(500).json({
      error: "Failed to fetch Instagram data. Check token or URL.",
    });
  }

  db.query(
    `INSERT INTO instagram_links 
     (url, image, username, embed_html, published) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      url,
      instagramData.image,
      instagramData.username,
      instagramData.embed_html,
      published ? 1 : 0,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: result.insertId,
        ...instagramData,
        url,
        published,
      });
    }
  );
});

// ─────────────────────────────────────────
// UPDATE LINK
// ─────────────────────────────────────────
app.put("/links/:id", async (req, res) => {
  const { id } = req.params;
  const { url, published } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });
  if (!instagramRegex.test(url)) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  const instagramData = await fetchInstagramData(url);

  if (!instagramData) {
    return res.status(500).json({
      error: "Failed to fetch Instagram data",
    });
  }

  db.query(
    `UPDATE instagram_links 
     SET url=?, image=?, username=?, embed_html=?, published=? 
     WHERE id=?`,
    [
      url,
      instagramData.image,
      instagramData.username,
      instagramData.embed_html,
      published ? 1 : 0,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Updated successfully" });
    }
  );
});

// ─────────────────────────────────────────
// DELETE LINK
// ─────────────────────────────────────────
app.delete("/links/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM instagram_links WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted successfully" });
  });
});

// ─────────────────────────────────────────
// TEST TOKEN
// ─────────────────────────────────────────
app.get("/test-token", async (req, res) => {
  const testUrl = "https://www.instagram.com/p/C0000000000/";

  const apiUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(
    testUrl
  )}&access_token=${ACCESS_TOKEN}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  res.json(data);
});

// ─────────────────────────────────────────
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});