const Task = require("../models/task.model");
const { analyzeTask } = require("../services/ai.service");

const createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  const aiResult = await analyzeTask(description);
  
  const task = await Task.create({
    title,
    description,
    deadline,
    priority: priority || aiResult.priority
  });

  res.json(task);
};

const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};


const getSuggestions = async (req, res) => {
  const tasks = await Task.find({ status: "pending" });

  if (tasks.length === 0) {
    return res.json({ message: "No tasks available" });
  }

  const highPriorityTask = tasks.find(t => t.priority === "High");

  if (highPriorityTask) {
    return res.json({
      suggestion: `Focus on: ${highPriorityTask.title}`
    });
  }

  res.json({
    suggestion: `Start with: ${tasks[0].title}`
  });
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  res.json(task);
};

module.exports = { createTask, getTasks, getSuggestions, updateTaskStatus };

