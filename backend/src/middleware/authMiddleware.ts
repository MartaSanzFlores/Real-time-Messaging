const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/error';
require('dotenv').config();

module.exports = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error: CustomError = new Error('No Authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err: any) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error: CustomError = new Error('No Authenticated')
        error.statusCode = 401;
        throw error;
    }

    next();
};