const { Todo } = require("../models");

const addTask = async (req, res, next) => {
  const { task, userId } = req.body;

  try {
    const newTask = await Todo.create({
      task,
      userId,
    });

    res.status(200).json({
      status: "success",
      msg: "Add Task Successfully",
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

const showTask = async (req, res, next) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addTask,
  showTask,
};
