require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./src/config");
const routes = require("./src/routes");
const { errorHandler } = require("./src/middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Health check
app.get("/", (req, res) => {
  res.send("Hello Dhiren - Now powered by PostgreSQL with Clean Architecture!");
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}/`);
});
