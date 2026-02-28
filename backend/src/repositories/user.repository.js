const prisma = require("../../prisma/client");

// Create a new user
const create = async (data) => {
    return prisma.user.create({ data });
};

// Find user by email
const findByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};

// Find user by ID
const findById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
};

// Find user by ID (exclude password)
const findByIdSafe = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
};

module.exports = {
    create,
    findByEmail,
    findById,
    findByIdSafe,
};
