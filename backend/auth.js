const jwt = require("jsonwebtoken");

const SECRET = "suyu-secret";

function generateToken(user) {
  return jwt.sign(user, SECRET);
}

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("未登录");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("token错误");
  }
}

module.exports = {
  generateToken,
  verifyToken
};
