const bcrypt = require("bcrypt");
const connectDB = require("../db");
const { generateToken } = require("../utils/generateToken");

const SALT_ROUNDS = 10;

exports.getAllUsers = async (req, res, next) => {
  try {
    const db = await connectDB();
    const users = await db.all("SELECT id, name, email FROM users");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const user = await db.get("SELECT id, name, email FROM users WHERE id = ?", id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) required." });
    }
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      name,
      email,
      hashedPassword
    );
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed: users.email")) {
      return res.status(409).json({ message: "Email already registered" });
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;
    if (!name || !email) {
      return res.status(400).json({ message: "Both name and email must be provided." });
    }
    const db = await connectDB();
    const { changes } = await db.run(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      name,
      email,
      id
    );
    if (changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const { changes } = await db.run("DELETE FROM users WHERE id = ?", id);
    if (changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Please provide a name to search." });
    }
    const db = await connectDB();
    const users = await db.all(
      "SELECT id, name, email FROM users WHERE name LIKE ?",
      `%${name}%`
    );
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const db = await connectDB();
    const user = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (!user) {
      return res.status(401).json({ status: "failed", message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "failed", message: "Invalid credentials" });
    }
    const token = generateToken(user.id, user.email);
    res.status(200).json({ status: "success", user_id: user.id, token: token });
  } catch (err) {
    next(err);
  }
};
