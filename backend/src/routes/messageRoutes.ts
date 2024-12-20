import express from 'express';
import messageController from '../controllers/messageController';
import { body } from 'express-validator';
import authenticate from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticate, messageController.getMessages);

router.post('/createMessage', authenticate, [ 
    body('content')
    .trim()
    .isString()
    .isLength({ min: 1 })
], messageController.createMessage);

router.patch('/isRead/:id', authenticate, messageController.isRead);

export default router;