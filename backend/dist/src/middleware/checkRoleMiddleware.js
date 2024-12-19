"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (req, res, next) => {
    const role = req.user.role;
    if (role !== 'admin') {
        const error = new Error('Not Authorized');
        error.statusCode = 403;
        throw error;
    }
    next();
};
exports.default = module.exports;
