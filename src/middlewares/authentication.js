const { user } = require("pg/lib/defaults");
const { verifyToken } = require("../helpers/jwt");
const { Users } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Token not found");
    }

    const [type, token] = authorization.split(" ");

    if (!token) {
      throw new Error("Token not found");
    }

    const { id } = verifyToken(token);
    const user = await Users.findByPk(id);

    if (!user) {
      throw new Error("Invalid user");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

module.exports = authentication;
