const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { nanoid } = require("nanoid");
const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        short_code TEXT PRIMARY KEY,
        original_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
    `);

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// Helper for URL validation
function isValidUrl(url) {
  return /^https?:\/\/[^ "]+$/.test(url);
}

// Shorten URL Endpoint
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    let short_code;
    let isUnique = false;
    const maxAttempts = 5;
    
    // Generate unique short code with collision handling
    for (let i = 0; i < maxAttempts && !isUnique; i++) {
      short_code = nanoid(6);
      const existing = await db.get(
        "SELECT 1 FROM urls WHERE short_code = ?", 
        [short_code]
      );
      if (!existing) isUnique = true;
    }

    if (!isUnique) {
      return res.status(500).json({ error: "Failed to generate unique code" });
    }

    await db.run(
      "INSERT INTO urls (short_code, original_url) VALUES (?, ?)",
      [short_code, url]
    );
    
    res.json({ 
      short_code, 
      short_url: `http://localhost:3000/${short_code}` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Redirect Endpoint
app.get("/:short_code", async (req, res) => {
  const { short_code } = req.params;
  
  try {
    const row = await db.get(
      "SELECT original_url FROM urls WHERE short_code = ?",
      [short_code]
    );
    
    if (!row) return res.status(404).send("Not found");
    
    await db.run(
      "UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?",
      [short_code]
    );
    
    res.redirect(row.original_url);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Analytics Endpoint
app.get("/api/stats/:short_code", async (req, res) => {
  const { short_code } = req.params;
  
  try {
    const row = await db.get(
      `SELECT original_url, clicks, 
      strftime('%Y-%m-%d %H:%M:%S', created_at) AS created_at 
      FROM urls WHERE short_code = ?`,
      [short_code]
    );
    
    if (!row) return res.status(404).json({ error: "Short code not found" });
    
    res.json({ 
      url: row.original_url, 
      clicks: row.clicks, 
      created_at: row.created_at 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => 
  res.json({ 
    status: "ok", 
    message: "URL Shortener API running",
    timestamp: new Date().toISOString()
  })
);

initializeDBAndServer();