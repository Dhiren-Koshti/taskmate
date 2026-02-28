const prisma = require("../../prisma/client");

// Create a new task
const create = async (data) => {
    return prisma.task.create({ data });
};

// Find task by ID
const findById = async (id) => {
    return prisma.task.findUnique({ where: { id } });
};

// Find tasks with filters
const findMany = async (filter) => {
    return prisma.task.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
    });
};

// Update task by ID
const update = async (id, data) => {
    return prisma.task.update({
        where: { id },
        data,
    });
};

// Delete task by ID
const deleteById = async (id) => {
    return prisma.task.delete({ where: { id } });
};

module.exports = {
    create,
    findById,
    findMany,
    update,
    deleteById,
};
