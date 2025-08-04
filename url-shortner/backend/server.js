const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { nanoid } = require("nanoid");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, "database.db"));

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS urls (
      short_code TEXT PRIMARY KEY,
      original_url TEXT,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

// Helper for URL validation
function isValidUrl(url) {
  return /^https?:\/\/[^ "]+$/.test(url);
}

// Shorten URL Endpoint
app.post("/api/shorten", (req, res) => {
  const { url } = req.body;
  if (!url || !isValidUrl(url)) return res.status(400).json({ error: "Invalid URL" });

  let short_code = nanoid(6);
  db.get("SELECT 1 FROM urls WHERE short_code = ?", short_code, (err, row) => {
    if (row) short_code = nanoid(6); // retry if collision

    db.run(
      "INSERT INTO urls (short_code, original_url) VALUES (?, ?)",
      [short_code, url],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ short_code, short_url: `http://localhost:3000/${short_code}` });
      }
    );
  });
});

// Redirect Endpoint
app.get("/:short_code", (req, res) => {
  const { short_code } = req.params;
  db.get("SELECT original_url FROM urls WHERE short_code = ?", [short_code], (err, row) => {
    if (!row) return res.status(404).send("Not found");
    db.run("UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?", [short_code]);
    res.redirect(row.original_url);
  });
});

// Analytics Endpoint
app.get("/api/stats/:short_code", (req, res) => {
  const { short_code } = req.params;
  db.get("SELECT original_url, clicks, created_at FROM urls WHERE short_code = ?", [short_code], (err, row) => {
    if (!row) return res.status(404).json({ error: "Short code not found" });
    res.json({ url: row.original_url, clicks: row.clicks, created_at: row.created_at });
  });
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", message: "URL Shortener API running" }));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
