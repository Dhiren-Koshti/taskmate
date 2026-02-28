const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const { transformUser } = require("../utils/transformers");
const { ApiError } = require("../middleware/errorHandler");
const config = require("../config");

// Create a new user
const createUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if email already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, "This Email Already Exists.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const authToken = jwt.sign({ user: newUser.id }, config.jwtSecret);

  return {
    type: "Success",
    msg: "Welcome to TaskMate!",
    authToken,
  };
};

// Login user
const loginUser = async (email, password) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(400, "Please Enter Correct Credentials");
  }

  // Compare password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(400, "Please Enter Correct Credentials");
  }

  // Generate JWT token
  console.log("config.jwtSecret --->", config.jwtSecret);
  const authToken = jwt.sign({ user: user.id }, config.jwtSecret);

  return {
    type: "Success",
    msg: "Welcome Back!",
    authToken,
  };
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await userRepository.findByIdSafe(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return transformUser(user);
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
};
