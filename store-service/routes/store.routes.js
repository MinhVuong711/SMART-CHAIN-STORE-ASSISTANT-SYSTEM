const express = require("express");
const router = express.Router();

const controller = require("../controllers/store.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// PUBLIC
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// CREATE → admin only
router.post("/", verifyToken, checkRole(["admin"]), controller.create);

// UPDATE → admin only
router.put("/:id", verifyToken, checkRole(["admin"]), controller.update);

// DELETE → admin only (soft delete)
router.delete("/:id", verifyToken, checkRole(["admin"]), controller.remove);

module.exports = router;
