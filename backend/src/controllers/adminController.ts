import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import AppDataSource from '../config/typeorm';
import { User } from '../models/User';
import { CustomError } from '../types/error';

import dotenv from 'dotenv';
dotenv.config();

interface UserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        role: string;
        userId: string;
    },
    user: {
        userId: string;
        role: string;
    };
}

exports.getUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userRepository = AppDataSource.getRepository(User);

        const users = await userRepository.find();

        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json({ users: usersWithoutPassword });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
};

exports.getUser = async (req: UserRequest, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    try {

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            const error: CustomError = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({ user: userWithoutPassword });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

exports.createUser = async (req: UserRequest, res: Response, next: NextFunction) => {

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
    const role = req.body.role;

    try {

        const hashedPW = await bcrypt.hash(password, 12);
        const userRepository = AppDataSource.getRepository(User);

        const user = userRepository.create({
            name: name,
            email: email,
            password: hashedPW,
            role: role
        })

        const result = await userRepository.save(user);

        res.status(201).json({ message: "User created by admin!", userId: result.id });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
};

exports.updateUser = async (req: UserRequest, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomError = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    const currentUserId = req.user.userId;
    const userId = req.params.id;
    const newName = req.body.name;
    const newEmail = req.body.email;
    let newPassword = req.body.password;
    const newRole = req.body.role;

    try {

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            const error: CustomError = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        if(newPassword === '') {
            newPassword = user.password;
        } else {
            if(newPassword.length < 5) {
                const error: CustomError = new Error('Password must be at least 5 characters long.');
                error.statusCode = 422;
                throw error;
            }
        }

        const hashedPW = await bcrypt.hash(newPassword, 12);

        user.name = newName;
        user.email = newEmail;
        user.password = hashedPW;

        if (currentUserId == userId && newRole && newRole != user.role) {
            const error: CustomError = new Error('You cannot change your own role.');
            error.statusCode = 403;
            throw error;
        } else if (newRole) {
            user.role = newRole;
        }

        const result = await userRepository.save(user);

        res.status(200).json({ message: "User updated!", userId: result.id });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

exports.deleteUser = async (req: UserRequest, res: Response, next: NextFunction) => {
    
    const userId = req.params.id;

    try {

        const currentUserId = req.user.userId;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            const error: CustomError = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        if(currentUserId == userId) {
            const error: CustomError = new Error('You cannot delete your own user.');
            error.statusCode = 403;
            throw error;
        }

        const result = await userRepository.remove(user);

        res.status(200).json({ message: "User deleted!", userId: result.id });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

export default exports;