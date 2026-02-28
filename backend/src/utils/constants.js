// Status colors
const STATUS_COLORS = {
    pending: "#f57c00",
    completed: "#4caf50",
    delayed: "#d32f2f",
};

// Priority levels (matching Prisma enum)
const PRIORITY = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CUSTOM: "CUSTOM",
};

// Status levels (matching Prisma enum)
const STATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    DELAYED: "DELAYED",
};

module.exports = {
    STATUS_COLORS,
    PRIORITY,
    STATUS,
};
