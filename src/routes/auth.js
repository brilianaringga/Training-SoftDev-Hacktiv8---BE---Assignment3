const router = require("express").Router();
const { register, login } = require("../controller/auth.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
