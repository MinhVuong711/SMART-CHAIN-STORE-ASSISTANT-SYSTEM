const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// CREATE ORDER → admin + staff
router.post("/", verifyToken, checkRole(["admin", "staff"]), controller.create);

// GET ALL → admin + staff
router.get("/", verifyToken, checkRole(["admin", "staff"]), controller.getAll);

module.exports = router;
