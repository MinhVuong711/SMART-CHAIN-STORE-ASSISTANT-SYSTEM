const service = require("../services/customer.service");

// CREATE
exports.create = async (req, res) => {
    const result = await service.create(req.body);
    res.json(result);
};

// GET ALL
exports.getAll = async (req, res) => {
    const data = await service.getAll();
    res.json(data);
};

// GET BY ID
exports.getById = async (req, res) => {
    const data = await service.getById(req.params.id);
    res.json(data);
};

// UPDATE
exports.update = async (req, res) => {
    await service.update(req.params.id, req.body);
    res.json({ message: "Updated" });
};

// DELETE
exports.remove = async (req, res) => {
    await service.remove(req.params.id);
    res.json({ message: "Deleted" });
};