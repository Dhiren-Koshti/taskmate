const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        type: "Error",
        msg: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

// Custom error class for API errors
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { errorHandler, ApiError };
