const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const taskRoutes = require("./task.routes");

// Mount routes
router.use("/user", userRoutes);
router.use("/task", taskRoutes);

module.exports = router;
