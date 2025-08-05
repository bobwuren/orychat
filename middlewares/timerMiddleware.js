// Middleware pour timer les endpoints
module.exports = (req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
        console.log(`🕒 [TIMER] ${req.method} ${req.originalUrl} - ${time} ms`);
    });
    next();
};

