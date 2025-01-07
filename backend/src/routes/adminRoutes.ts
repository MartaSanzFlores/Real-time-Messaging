import express from 'express';
import adminController from '../controllers/adminController';
import authenticate from '../middleware/authMiddleware';
import isAdmin from '../middleware/checkRoleMiddleware';
import { body } from 'express-validator';
import AppDataSource from '../config/typeorm';
import { User } from '../models/User';

const router = express.Router();

router.get('/getUsers', authenticate, isAdmin, adminController.getUsers);

router.get('/getUser/:id', authenticate, isAdmin, adminController.getUser);

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
],
    adminController.createUser);

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

router.delete('/deleteUser/:id', authenticate, isAdmin , adminController.deleteUser);

export default router;