const service = require("../services/product.service");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const { store_id } = req.params;

    // validate store_id
    if (!Number.isInteger(Number(store_id))) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    const data = await service.getAll(Number(store_id));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const { id, store_id } = req.params;

    // validate id
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // validate store_id
    if (!Number.isInteger(Number(store_id))) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    const data = await service.getById(Number(id), Number(store_id));

    if (!data) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE (ADMIN ONLY)
exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { store_id } = req.params;
    const { name, price, description = "" } = req.body;

    const parsedStoreId = Number(store_id);
    const parsedPrice = Number(price);

    // validate input
    if (
      !name ||
      isNaN(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedStoreId)
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // 🔥 CHECK QUYỀN STORE (QUAN TRỌNG NHẤT)
    if (req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden: wrong store" });
    }

    const result = await service.create({
      name,
      price: parsedPrice,
      description,
      store_id: parsedStoreId,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE (ADMIN ONLY)
exports.update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, store_id } = req.params;
    const { name, price, description } = req.body;

    const parsedId = Number(id);
    const parsedStoreId = Number(store_id);
    const parsedPrice = price !== undefined ? Number(price) : undefined;

    // validate id
    if (!Number.isInteger(parsedId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // validate store_id
    if (!Number.isInteger(parsedStoreId)) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    // 🔥 CHECK QUYỀN STORE
    if (req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden: wrong store" });
    }

    // phải có ít nhất 1 field
    if (
      name === undefined &&
      parsedPrice === undefined &&
      description === undefined
    ) {
      return res.status(400).json({ error: "No data to update" });
    }

    // validate price
    if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const result = await service.update(parsedId, {
      name,
      price: parsedPrice,
      description,
      store_id: parsedStoreId,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE (ADMIN ONLY)
exports.remove = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, store_id } = req.params;

    const parsedId = Number(id);
    const parsedStoreId = Number(store_id);

    // validate id
    if (!Number.isInteger(parsedId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // validate store_id
    if (!Number.isInteger(parsedStoreId)) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    // CHECK QUYỀN STORE
    if (req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden: wrong store" });
    }

    const result = await service.remove(parsedId, parsedStoreId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};