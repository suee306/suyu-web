const express = require("express");
const cors = require("cors");

const app = express();

// 解析 JSON 请求体（POST /api/... 会用到）
app.use(express.json());

// 允许 Vercel 前端跨域访问；部署时在平台里设置 ALLOWED_ORIGINS
// 例：ALLOWED_ORIGINS=https://你的项目.vercel.app,https://你的域名.com
const allowedRaw = process.env.ALLOWED_ORIGINS;
const corsOrigin =
  allowedRaw && allowedRaw.trim()
    ? allowedRaw.split(",").map((s) => s.trim())
    : true; // 未配置时开发方便；上线请务必配置 ALLOWED_ORIGINS

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

console.log("🔥 测试服务器启动");

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/test", (req, res) => {
  res.send("POST OK");
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`✅ http://127.0.0.1:${PORT}`);
});
