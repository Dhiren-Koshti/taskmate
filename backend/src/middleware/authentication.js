const jwt = require("jsonwebtoken");
const config = require("../config");

const authentication = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({
            type: "Error",
            msg: "Please authenticate using a valid token",
        });
    }

    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({
            type: "Error",
            msg: "Please authenticate using a valid token",
        });
    }
};

module.exports = authentication;
