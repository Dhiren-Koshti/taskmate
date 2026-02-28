const taskRepository = require("../repositories/task.repository");
const { transformTask, transformTasks } = require("../utils/transformers");
const { isValidUUID } = require("../utils/validators");
const { STATUS_COLORS, STATUS, PRIORITY } = require("../utils/constants");
const { ApiError } = require("../middleware/errorHandler");

// Build filter for task queries
const buildTaskFilter = (userId, query) => {
    const filter = { userId };
    const {
        date,
        month,
        year,
        category,
        priority,
        deadline,
        status,
        isCompleted,
        taskTitle,
        _id,
    } = query;

    // Date filter
    if (date) {
        const startOfDay = new Date(date);
        if (isNaN(startOfDay.getTime())) {
            throw new ApiError(400, "Invalid date format");
        }
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        filter.createdAt = { gte: startOfDay, lte: endOfDay };
    }

    // Month filter
    if (month) {
        const yearForMonth = year || new Date().getFullYear();
        if (isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
            throw new ApiError(400, "Invalid month (1-12)");
        }
        const startOfMonth = new Date(
            `${yearForMonth}-${String(month).padStart(2, "0")}-01`
        );
        const endOfMonth = new Date(
            new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1) - 1
        );
        filter.createdAt = { gte: startOfMonth, lte: endOfMonth };
    }

    // Year filter
    if (year && !month) {
        if (isNaN(Number(year)) || Number(year) < 2000 || Number(year) > 2099) {
            throw new ApiError(400, "Invalid year (2000-2099)");
        }
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        filter.createdAt = { gte: startOfYear, lte: endOfYear };
    }

    // Category filter
    if (category) {
        filter.category = { contains: category, mode: "insensitive" };
    }

    // Priority filter
    if (priority) {
        filter.priority = priority.toUpperCase();
    }

    // Deadline filter
    if (deadline) {
        if (deadline === "withDeadline") {
            filter.deadline = { not: null };
        } else if (deadline === "withoutDeadline") {
            filter.deadline = null;
        }
    }

    // Status filter
    if (status) {
        filter.status = status.toUpperCase();
    }

    // Completion filter
    if (isCompleted !== undefined) {
        filter.isCompleted = isCompleted === "true";
    }

    // Title search
    if (taskTitle) {
        filter.taskTitle = { contains: taskTitle, mode: "insensitive" };
    }

    // ID filter
    if (_id) {
        filter.id = _id;
    }

    return filter;
};

// Get tasks with filters
const getTasks = async (userId, query) => {
    const filter = buildTaskFilter(userId, query);
    const tasks = await taskRepository.findMany(filter);
    return transformTasks(tasks);
};

// Create a new task
const createTask = async (userId, taskData) => {
    const { taskTitle, description, priority, category, deadline } = taskData;

    // Validate custom priority requires deadline
    if (priority === "custom" && !deadline) {
        throw new ApiError(400, "Deadline is required for custom priority");
    }

    let taskStatus = STATUS.PENDING;
    let statusColor = STATUS_COLORS.pending;
    let taskDeadline = null;

    if (priority === "custom" && deadline) {
        taskDeadline = new Date(deadline);
        // Auto-set to delayed if deadline is in past
        if (new Date(deadline) < new Date()) {
            taskStatus = STATUS.DELAYED;
            statusColor = STATUS_COLORS.delayed;
        }
    }

    const newTask = await taskRepository.create({
        userId,
        taskTitle,
        description,
        priority: priority.toUpperCase(),
        status: taskStatus,
        statusColor,
        category,
        isCompleted: false,
        deadline: taskDeadline,
    });

    return transformTask(newTask);
};

// Update a task
const updateTask = async (userId, taskId, updateData) => {
    // Validate UUID
    if (!isValidUUID(taskId)) {
        throw new ApiError(404, "Task not found");
    }

    // Find task
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Authorization check
    if (task.userId !== userId) {
        throw new ApiError(401, "Not authorized");
    }

    const { taskTitle, description, priority, category, deadline, isCompleted } =
        updateData;
    const updates = {};
    const isDeadlinePassed =
        task.deadline && new Date(task.deadline) < new Date();

    // Block priority/deadline changes if deadline passed
    if (isDeadlinePassed) {
        if (priority !== undefined && priority.toUpperCase() !== task.priority) {
            throw new ApiError(400, "Cannot modify priority after deadline passed");
        }
        if (deadline !== undefined) {
            throw new ApiError(400, "Cannot modify deadline after it passed");
        }
    }

    // Handle deadline updates
    if (deadline !== undefined && !isDeadlinePassed) {
        const effectivePriority = priority
            ? priority.toUpperCase()
            : task.priority;
        if (effectivePriority === PRIORITY.CUSTOM) {
            if (new Date(deadline) < new Date()) {
                throw new ApiError(400, "Deadline must be in the future");
            }
            updates.deadline = new Date(deadline);
        } else {
            throw new ApiError(
                400,
                "Deadline can only be set for custom priority tasks"
            );
        }
    }

    // Handle priority changes
    if (priority !== undefined && !isDeadlinePassed) {
        updates.priority = priority.toUpperCase();
        if (task.priority === PRIORITY.CUSTOM && priority.toUpperCase() !== PRIORITY.CUSTOM) {
            updates.deadline = null;
        } else if (
            priority.toUpperCase() === PRIORITY.CUSTOM &&
            !deadline &&
            !task.deadline
        ) {
            throw new ApiError(400, "Deadline required for custom priority");
        }
    }

    // Handle other fields
    if (taskTitle) updates.taskTitle = taskTitle;
    if (description) updates.description = description;
    if (category) updates.category = category;

    // Handle completion status
    if (isCompleted === true || isCompleted === false) {
        updates.isCompleted = isCompleted;
        if (isCompleted) {
            const effectivePriority = priority
                ? priority.toUpperCase()
                : task.priority;
            const effectiveDeadline = deadline ? new Date(deadline) : task.deadline;

            if (effectivePriority === PRIORITY.CUSTOM && effectiveDeadline) {
                updates.status =
                    new Date() <= effectiveDeadline ? STATUS.COMPLETED : STATUS.DELAYED;
                updates.statusColor =
                    new Date() <= effectiveDeadline
                        ? STATUS_COLORS.completed
                        : STATUS_COLORS.delayed;
            } else {
                updates.status = STATUS.COMPLETED;
                updates.statusColor = STATUS_COLORS.completed;
            }
        } else {
            updates.status = STATUS.PENDING;
            updates.statusColor = STATUS_COLORS.pending;
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    const updatedTask = await taskRepository.update(taskId, updates);
    return transformTask(updatedTask);
};

// Delete a task
const deleteTask = async (userId, taskId) => {
    // Validate UUID
    if (!isValidUUID(taskId)) {
        throw new ApiError(404, "Task not found");
    }

    // Find task
    const task = await taskRepository.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Authorization check
    if (task.userId !== userId) {
        throw new ApiError(401, "Not allowed");
    }

    const deletedTask = await taskRepository.deleteById(taskId);
    return transformTask(deletedTask);
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
