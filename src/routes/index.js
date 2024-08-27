const router = require("express").Router();
const auth = require("./auth");
const todo = require("./todo");
const authentication = require("../middlewares/authentication");

router.use(auth);
router.use(authentication);
router.use(todo);

module.exports = router;
