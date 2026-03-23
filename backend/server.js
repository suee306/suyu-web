const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const db = require("./db");
const auth = require("./auth");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 图片访问
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({
  dest: path.join(__dirname, "uploads")
});

/* 首页 */
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

/* 注册 */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    () => res.send("注册成功")
  );
});

/* 登录 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username=?", [username], async (err, user) => {
    if (!user) return res.status(400).send("用户不存在");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).send("密码错误");

    const token = auth.generateToken({ id: user.id, username });
    res.json({ token });
  });
});

/* 写笔记 */
app.post("/notes", auth.verifyToken, (req, res) => {
  const { content, tags, image } = req.body;

  db.run(
    "INSERT INTO notes (content, tags, user_id, image) VALUES (?, ?, ?, ?)",
    [content, tags, req.user.id, image],
    () => res.send("保存成功")
  );
});

/* 获取笔记 */
app.get("/notes", auth.verifyToken, (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE user_id=?",
    [req.user.id],
    (err, rows) => res.json(rows)
  );
});

/* 搜索 */
app.get("/search", auth.verifyToken, (req, res) => {
  const keyword = req.query.q;

  db.all(
    "SELECT * FROM notes WHERE content LIKE ? AND user_id=?",
    [`%${keyword}%`, req.user.id],
    (err, rows) => res.json(rows)
  );
});

/* 上传图片 */
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
