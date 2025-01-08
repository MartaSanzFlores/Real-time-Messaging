import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController';
import { User } from '../models/User';
import AppDataSource from '../config/typeorm';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with an email, name, and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user (minimum 5 characters).
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User created!
 *       422:
 *         description: Validation error (Invalid data format, etc.)
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with an email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user (minimum 5 characters).
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token to authenticate further requests.
 *             example:
 *               message: User logged in!
 *               token: "your_generated_jwt_token_here"
 *       401:
 *         description: User not found or wrong password
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password')
        .trim()
], authController.login);


export default router;



