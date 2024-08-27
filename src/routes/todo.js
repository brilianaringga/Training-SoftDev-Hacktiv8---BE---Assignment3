const router = require("express").Router();
const { addTask, showTask } = require("../controller/todo.controller");

router.post("/addtask", addTask);
router.get("/showTask", showTask);

module.exports = router;
