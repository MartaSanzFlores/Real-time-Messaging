"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('No Authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        const error = new Error('No Authenticated');
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    try {
        const jwt = require('jsonwebtoken');
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        const error = new Error('Your session has expired. Please log in again.');
        error.statusCode = 401;
        throw error;
    }
    if (!decodedToken) {
        const error = new Error('No Authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.user = {
        userId: decodedToken.userId,
        role: decodedToken.role
    };
    next();
};
exports.default = module.exports;
