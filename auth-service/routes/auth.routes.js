const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../../shared/auth.middleware");

// TEST ROUTE (public)
router.get("/test", (req, res) => {
  res.send("AUTH OK");
});

// REGISTER (public)
router.post("/register", authController.register);

// LOGIN (public)
router.post("/login", authController.login);

// 🔥 ROUTE PROTECTED (cần token)
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Protected route success",
    user: req.user,
  });
});

module.exports = router;
