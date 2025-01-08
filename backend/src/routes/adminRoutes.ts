import express from 'express';
import adminController from '../controllers/adminController';
import authenticate from '../middleware/authMiddleware';
import isAdmin from '../middleware/checkRoleMiddleware';
import { body } from 'express-validator';
import AppDataSource from '../config/typeorm';
import { User } from '../models/User';

const router = express.Router();

/**
 * @swagger
 * /admin/getUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: This endpoint is accessible only by users with the `admin` role.
 *     tags: [Admin]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *             example:
 *               users: [
 *                 {
 *                   id: "1",
 *                   name: "John Doe",
 *                   email: "john@doe.com",
 *                   role: "user"
 *                 }
 *               ]
 *       401:
 *         description: No autenticated user
 *       403:
 *         description: Forbidden (User is not an admin)
 *       500:
 *         description: Internal Server Error
 */
router.get('/getUsers', authenticate, isAdmin, adminController.getUsers);

/**
 * @swagger
 * /admin/getUser/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     description: This endpoint is accessible only by users with the `admin` role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []  # Indique que cette route nécessite une authentification JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *             example:
 *               id: "1"
 *               name: "John Doe"
 *               email: "john@doe.com"
 *               role: "user"
 *       401:
 *         description: No authenticated user
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getUser/:id', authenticate, isAdmin, adminController.getUser);

/**
 * @swagger
 * /admin/createUser:
 *   post:
 *     summary: Create a new user (Admin only)
 *     description: This endpoint is accessible only by users with the `admin` role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []  # Indique que cette route nécessite une authentification JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User created by admin!
 *       401:
 *         description: No authenticated user
 *       403:
 *         description: Forbidden (User is not an admin)
 *       500:
 *         description: Internal Server Error
 */
router.post('/createUser', authenticate, [
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
], adminController.createUser);

/**
 * @swagger
 * /admin/updateUser/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     description: This endpoint is accessible only by users with the `admin` role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []  # Indique que cette route nécessite une authentification JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User updated!
 *       401:
 *         description: No authenticated user
 *       403:
 *         description: Forbidden (User is not an admin)
 *       500:
 *         description: Internal Server Error
 */
router.put('/updateUser/:id', authenticate, isAdmin, [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async (value: string, { req }) => {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOneBy({ email: value });
            if (existingUser && (existingUser.id != req.params!.id)) {
                throw new Error('E-Mail address already exists!');
            }
            return true;
        })
        .normalizeEmail(),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
], adminController.updateUser);

/**
 * @swagger
 * /admin/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: This endpoint is accessible only by users with the `admin` role.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []  # Indique que cette route nécessite une authentification JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: User deleted!
 *       401:
 *         description: No authenticated user
 *       403:
 *         description: Forbidden (User is not an admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteUser/:id', authenticate, isAdmin, adminController.deleteUser);

export default router;