const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(payload) {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  return token;
}

function verifyToken(token) {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports = {
  generateToken,
  verifyToken,
};
