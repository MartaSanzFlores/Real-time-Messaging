import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import AppDataSource from '../config/typeorm';
import { User } from '../models/User';
import { CustomError } from '../types/error';

import dotenv from 'dotenv';
dotenv.config();

interface AuthRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role: string;
    };
}

exports.signup = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomError = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {

        const hashedPW = await bcrypt.hash(password, 12);
        const userRepository = AppDataSource.getRepository(User);

        const [users, usersCount] = await userRepository.findAndCount();

        const userRole = usersCount === 0 ? "admin" : "user";

        const user = userRepository.create({
            name: name,
            email: email,
            password: hashedPW,
            role: userRole
        })

        const result = await userRepository.save(user);

        res.status(201).json({ message: "User created!", userId: result.id });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
};

exports.login = async (req: Request, res: Response, next: NextFunction) => {
    
    const email = req.body.email;
    const password = req.body.password;

    try {

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: email });
        let loadedUser;

        if (!user) {
            const error: CustomError = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        loadedUser = user;

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error: CustomError = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser.id, 
                userName: loadedUser.name,
                role: loadedUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "User logged in!", token: token });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

export default exports;