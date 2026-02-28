const userService = require("../services/user.service");

// Create new user
const createUser = async (req, res, next) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Get current user
const getUser = async (req, res, next) => {
    try {
        const userId = req.user;
        const user = await userService.getUserById(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    login,
    getUser,
};
