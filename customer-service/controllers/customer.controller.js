const service = require("../services/customer.service");

//CREATE
exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing name or phone" });
    }

    // validate phone format
    if (!/^[0-9]{9,11}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone format" });
    }

    const user = req.user;

    const result = await service.create({
      ...req.body,
      store_id: user.store_id,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.user;

    let data;

    // admin xem tất cả
    if (user.role === "admin") {
      data = await service.getAll(); // không truyền store_id
    }
    // staff chỉ xem store của mình
    else {
      data = await service.getAll(user.store_id);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // validate id
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const user = req.user;

    let data;

    if (user.role === "admin") {
      data = await service.getById(req.params.id); // admin xem tất cả
    } else {
      data = await service.getById(req.params.id, user.store_id); // staff bị giới hạn
    }

    if (!data) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // validate id
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    let { name, phone, email } = req.body;

    if (name !== undefined) name = name.trim();
    if (phone !== undefined) phone = phone.trim();
    if (email !== undefined) email = email.trim();

    // validate body (phải có ít nhất 1 field)
    if (name === undefined && phone === undefined && email === undefined) {
      return res.status(400).json({ error: "No data to update" });
    }

    // validate empty string
    if (name !== undefined && name === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    // validate phone format
    if (phone !== undefined && !/^[0-9]{9,11}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone format" });
    }

    const user = req.user;

    const result = await service.update(
      req.params.id,
      { name, phone, email },
      user.role === "admin" ? null : user.store_id,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //validate id
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const user = req.user;

    const result = await service.remove(
      req.params.id,
      user.role === "admin" ? null : user.store_id,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
