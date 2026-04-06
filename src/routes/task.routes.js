const express = require("express");
const router = express.Router();

const { createTask, getTasks, getSuggestions, updateTaskStatus } = require("../controllers/task.controller");

router.post("/create", createTask);
router.get("/", getTasks);
router.get("/suggestion", getSuggestions);
router.patch("/:id/status", updateTaskStatus);

module.exports = router;