import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController';
import { User } from '../models/User';
import AppDataSource from '../config/typeorm';

const router = express.Router();

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(async (value: string) => {
                const userRepository = AppDataSource.getRepository(User);
                const existingUser = await userRepository.findOneBy({ email: value });
                if (existingUser) {
                    throw new Error('E-Mail address already exists!');
                }
                return true;
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long.'),
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required.')
    ],
    authController.signup
);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
], authController.login);


export default router;



