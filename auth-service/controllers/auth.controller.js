const authService = require("../services/auth.service");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, password, store_id } = req.body;

    // validate required
    if (!username || !password || store_id === undefined) {
      return res.status(400).json({
        error: "username, password, store_id are required",
      });
    }

    // validate format store_id
    if (!Number.isInteger(Number(store_id)) || Number(store_id) <= 0) {
      return res.status(400).json({
        error: "Invalid store_id",
      });
    }

    const result = await authService.register({
      username,
      password,
      store_id: Number(store_id),
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔥 thêm validate nhẹ (thiếu là fail sớm)
    if (!username || !password) {
      return res.status(400).json({
        error: "username and password are required",
      });
    }

    const result = await authService.login({ username, password });

    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};