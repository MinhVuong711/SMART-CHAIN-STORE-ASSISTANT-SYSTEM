const service = require("../services/analytics.service");

// GET REVENUE
exports.getRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id } = req.query;
    const parsedStoreId = Number(store_id);

    if (!Number.isInteger(parsedStoreId) || parsedStoreId <= 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    // staff chỉ xem store mình
    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const data = await service.getRevenue(parsedStoreId, token);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET DAILY REVENUE
exports.getDailyRevenue = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id } = req.query;
    const parsedStoreId = Number(store_id);

    if (!Number.isInteger(parsedStoreId) || parsedStoreId <= 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const data = await service.getDailyRevenue(parsedStoreId, token);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TOP PRODUCTS
exports.getTopProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id, limit = 5 } = req.query;
    const parsedStoreId = Number(store_id);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedStoreId) || parsedStoreId <= 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const data = await service.getTopProducts(
      parsedStoreId,
      parsedLimit,
      token,
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SUMMARY
exports.getSummary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id } = req.query;
    const parsedStoreId = Number(store_id);

    if (!Number.isInteger(parsedStoreId) || parsedStoreId <= 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    const data = await service.getSummary(parsedStoreId, token);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
