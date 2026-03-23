const jwt = require("jsonwebtoken");

const SECRET = "suyu_secret";

function generateToken(user) {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("未登录");
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("token失效");
  }
}

module.exports = {
  generateToken,
  verifyToken
};
