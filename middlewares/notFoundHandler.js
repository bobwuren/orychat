const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: true,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
};

module.exports = notFoundHandler;
