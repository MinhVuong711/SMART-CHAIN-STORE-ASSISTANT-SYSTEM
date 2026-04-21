const express = require("express");
const router = express.Router();

const controller = require("../controllers/ai.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// Hỏi AI — admin + staff đều dùng được
router.post("/ask", verifyToken, checkRole(["admin", "staff"]), controller.ask);

module.exports = router;
