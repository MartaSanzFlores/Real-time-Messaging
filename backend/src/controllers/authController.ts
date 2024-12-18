import { Response, NextFunction } from 'express';
import AppDataSource from '../config/typeorm';
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
import { CustomError } from '../types/error';

interface Request {
    body: {
        name: string;
        email: string;
        password: string;
    };
}

exports.signup = async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomError = new Error('Validation failed.');
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

        const user = userRepository.create({
            name: name,
            email: email,
            password: hashedPW,
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