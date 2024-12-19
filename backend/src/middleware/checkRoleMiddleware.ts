import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/error';

export interface UserRequest extends Request {
    user: {
        userId: string;
        role: string;
    };
}

module.exports = (req: UserRequest, res: Response, next: NextFunction) => {

    const role = req.user.role;

    if (role !== 'admin') {
        const error: CustomError = new Error('Not Authorized')
        error.statusCode = 403;
        throw error;
    }

    next();
};

export default module.exports;