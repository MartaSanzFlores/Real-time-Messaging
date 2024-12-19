import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/error';

import dotenv from 'dotenv';

dotenv.config();

export interface UserRequest extends Request {
    user: {
        userId: string;
        role: string;
    };
}

module.exports = (req: UserRequest, res: Response, next: NextFunction) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error: CustomError = new Error('No Authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        const jwt = require('jsonwebtoken');
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

    req.user = {
        userId: decodedToken.userId,
        role: decodedToken.role
    };

    next();
};

export default module.exports;