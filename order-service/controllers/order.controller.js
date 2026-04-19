const service = require("../services/order.service");

// CREATE ORDER
exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.user;
    const { items, customer_id } = req.body;

    // validate input sớm
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    if (!Number.isInteger(Number(customer_id))) {
      return res.status(400).json({ error: "Invalid customer_id" });
    }

    // check store sớm
    const firstStore = Number(items[0].store_id);

    if (!Number.isInteger(firstStore)) {
      return res.status(400).json({ error: "Invalid store_id in items" });
    }

    if (req.user.role !== "admin" && firstStore !== user.store_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const result = await service.create(user, req.body, token);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);

    let status = 500;
    const msg = (err.message || "").toLowerCase();

    if (msg.includes("not found")) {
      status = 404;
    } else if (
      msg.includes("must") ||
      msg.includes("invalid") ||
      msg.includes("required")
    ) {
      status = 400;
    }

    res.status(status).json({
      error: err.message || "Create order failed",
    });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id } = req.query;
    const parsedStoreId = Number(store_id);

    if (!Number.isInteger(parsedStoreId)) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const data = await service.getAll(parsedStoreId);

    res.json(data);
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
};
