import express from 'express';
import messageController from '../controllers/messageController';
import { body } from 'express-validator';
import authenticate from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all messages
 *     description: Get all messages
 *     tags: [Messages]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       status:
 *                         type: string
 *                       senderName:
 *                         type: string
 *                       senderId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *             example:
 *               messages: [
 *                 {
 *                   id: "1",
 *                   content: "Hello, how are you?",
 *                   status: "pending",
 *                   senderName: "John Doe",
 *                   senderId: "1",
 *                   createdAt: "2021-12-01T12:00:00.000Z"
 *                 }
 *               ]
 *       401:
 *         description: No autenticated user
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticate, messageController.getMessages);

/**
 * @swagger
 * /messages/createMessage:
 *   post:
 *     summary: Create a new message
 *     description: Create a new message
 *     tags: [Messages]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     status:
 *                       type: string
 *                     senderName:
 *                       type: string
 *                     senderId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *             example:
 *               message: Message created!
 *               savedMessage: {
 *                 id: "1",
 *                 content: "Hello, how are you?",
 *                 status: "pending",
 *                 senderName: "John Doe",
 *                 senderId: "1",
 *                 createdAt: "2021-12-01T12:00:00.000Z"
 *               }
 *       422:
 *         description: Validation failed
 *       401:
 *         description: No autenticated user
 *       500:
 *         description: Internal Server Error
 */
router.post('/createMessage', authenticate, [
    body('content')
        .trim()
        .isString()
        .isLength({ min: 1 })
], messageController.createMessage);


// router.patch('/isRead/:id', authenticate, messageController.isRead);

export default router;