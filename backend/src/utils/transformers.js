// Transform Prisma Task to Frontend format
const transformTask = (task) => ({
    _id: task.id,
    user: task.userId,
    taskTitle: task.taskTitle,
    description: task.description,
    priority: task.priority.toLowerCase(),
    category: task.category,
    status: task.status.toLowerCase(),
    statusColor: task.statusColor,
    isCompleted: task.isCompleted,
    deadline: task.deadline,
    date: task.createdAt,
});

// Transform multiple tasks
const transformTasks = (tasks) => tasks.map(transformTask);

// Transform Prisma User to Frontend format (excludes password)
const transformUser = (user) => ({
    _id: user.id,
    name: user.name,
    email: user.email,
    date: user.createdAt,
});

module.exports = {
    transformTask,
    transformTasks,
    transformUser,
};
