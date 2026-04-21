const service = require("../services/ai.service");

exports.ask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { question, store_id } = req.body;

    // validate
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    const parsedStoreId = Number(store_id);

    if (!Number.isInteger(parsedStoreId) || parsedStoreId <= 0) {
      return res.status(400).json({ error: "Invalid store_id" });
    }

    // staff chỉ hỏi về store mình
    if (req.user.role !== "admin" && req.user.store_id !== parsedStoreId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    const answer = await service.ask({
      question: question.trim(),
      store_id: parsedStoreId,
      user: req.user,
      token,
    });

    res.json({ answer });
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).json({ error: err.message || "AI service error" });
  }
};
