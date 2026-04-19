const service = require("../services/store.service");

// CREATE STORE (admin only)
exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Store name is required" });
    }

    const result = await service.create({ name, address });

    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("exists")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

// GET ALL (public hoặc login đều được)
exports.getAll = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page <= 0) {
      return res.status(400).json({ error: "Invalid page" });
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      return res.status(400).json({ error: "Invalid limit" });
    }

    const data = await service.getAll(page, limit);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const data = await service.getById(id);

    if (!data) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (admin only)
exports.update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const { name, address } = req.body;

    if (name === undefined && address === undefined) {
      return res.status(400).json({ error: "No data to update" });
    }

    const result = await service.update(id, { name, address });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (soft delete - admin only)
exports.remove = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await service.remove(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
