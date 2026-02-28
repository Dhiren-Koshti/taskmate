const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const taskController = require("../controllers/task.controller");
const authentication = require("../middleware/authentication");
const validate = require("../middleware/validation");

// GET /task/gettask - Get tasks with filters
router.get("/gettask", authentication, taskController.getTasks);

// POST /task/addtask - Create a new task
router.post(
    "/addtask",
    authentication,
    [
        body("taskTitle")
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters"),
        body("description")
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters"),
        body("category")
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Category must be at least 2 characters"),
        body("priority")
            .isIn(["low", "medium", "high", "custom"])
            .withMessage("Invalid priority"),
        body("deadline")
            .optional()
            .isISO8601()
            .withMessage("Deadline must be a valid ISO date"),
    ],
    validate,
    taskController.addTask
);

// PUT /task/updatetask/:id - Update a task
router.put("/updatetask/:id", authentication, taskController.updateTask);

// DELETE /task/deletetask/:id - Delete a task
router.delete("/deletetask/:id", authentication, taskController.deleteTask);

module.exports = router;
