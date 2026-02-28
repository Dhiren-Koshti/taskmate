const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");
const validate = require("../middleware/validation");

// POST /user/createuser - Register new user
router.post(
    "/createuser",
    [
        body("name")
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password")
            .isLength({ min: 7 })
            .withMessage("Password must be at least 7 characters"),
    ],
    validate,
    userController.createUser
);

// POST /user/login - Login user
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    validate,
    userController.login
);

// GET /user/getuser - Get current user (requires auth)
router.get("/getuser", authentication, userController.getUser);

module.exports = router;
