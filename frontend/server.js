import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.FRONTEND_PORT || 8080);
app.get("/health", (_req, res) => res.json({ status: "ok", service: "frontend" }));
app.get("/app-config.js", (_req, res) => {
  res.type("application/javascript").send(`window.APP_CONFIG = { API_GATEWAY_URL: ${JSON.stringify(process.env.API_GATEWAY_URL || "http://localhost:3000")} };`);
});
app.get(["/login", "/login/"], (_req, res) => res.sendFile(path.join(__dirname, "public/pages/login/index.html")));
app.get(["/stores", "/stores/"], (_req, res) => res.sendFile(path.join(__dirname, "public/pages/stores/index.html")));
app.get(["/products", "/products/"], (_req, res) => res.sendFile(path.join(__dirname, "public/pages/products/index.html")));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "public/pages/home/index.html")));
app.listen(port, () => console.log(`Frontend running on port ${port}`));
