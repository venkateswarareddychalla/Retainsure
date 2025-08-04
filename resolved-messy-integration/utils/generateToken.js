const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "replace_this_secret_in_production";

function generateToken(userId, userEmail) {
  return jwt.sign({ userId, userEmail }, SECRET, { expiresIn: "2h" });
}

module.exports = { generateToken };
