const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { User } = require("../models/User");
import AppDataSource from '../config/typeorm';

const userRepository = AppDataSource.getRepository(User);

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(async (value: string) => {
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

router.post('/login', authController.login);


module.exports = router;



