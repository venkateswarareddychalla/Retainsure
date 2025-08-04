const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { NotFoundError, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "User Management System API is running." });
});

// 404 handler
app.use(NotFoundError);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
});
