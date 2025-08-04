const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.post("/users", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.get("/search", searchUsers);
router.post("/login", loginUser);

module.exports = router;
