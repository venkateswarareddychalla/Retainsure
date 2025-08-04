const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = path.join(__dirname, "database.db");

let db;

const connectDB = async () => {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // Ensure users table exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);
    // Optional: Add seed users if DB is empty
    const row = await db.get("SELECT COUNT(*) as cnt FROM users");
    if (row.cnt === 0) {
      await db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        "John Doe", "john@example.com", "$2b$10$v0E/2AC1nZlDI9GVaVdyM.sQiyhVyvIjYA2QO2vqXBmPGxX6K8Nnm" // password123
      );
      await db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        "Jane Smith", "jane@example.com", "$2b$10$n4wZZEMnPpOhldGhWWGcB.Jobf1Sr1R/auY7Lf1kH9JYNSv8nPLuu" // secret456
      );
      await db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        "Bob Johnson", "bob@example.com", "$2b$10$YWk0C2nOPWtk/.4QDBDE2OlnUG0K2EZ/rp0XkqTHUBhW5Mowdai12" // qwerty789
      );
    }
  }
  return db;
};

module.exports = connectDB;
