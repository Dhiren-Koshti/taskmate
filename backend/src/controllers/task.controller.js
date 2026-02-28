const taskService = require("../services/task.service");

// Get all tasks with filters
const getTasks = async (req, res, next) => {
    try {
        const userId = req.user;
        const tasks = await taskService.getTasks(userId, req.query);
        res.json({ success: true, tasks });
    } catch (error) {
        next(error);
    }
};

// Create a new task
const addTask = async (req, res, next) => {
    try {
        const userId = req.user;
        const task = await taskService.createTask(userId, req.body);
        res.status(201).json({
            success: true,
            task,
            message: "Task added successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Update a task
const updateTask = async (req, res, next) => {
    try {
        const userId = req.user;
        const taskId = req.params.id;
        const task = await taskService.updateTask(userId, taskId, req.body);
        res.json({
            type: "Success",
            msg: "Task updated successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a task
const deleteTask = async (req, res, next) => {
    try {
        const userId = req.user;
        const taskId = req.params.id;
        const task = await taskService.deleteTask(userId, taskId);
        res.json({
            type: "Success",
            msg: "Task deleted successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
};
