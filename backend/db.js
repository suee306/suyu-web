const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

// 用户表
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
)
`);

// 笔记表
db.run(`
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  tags TEXT,
  user_id INTEGER,
  image TEXT
)
`);

module.exports = db;
