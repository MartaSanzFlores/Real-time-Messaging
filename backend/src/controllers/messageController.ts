import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomError } from '../types/error';
import Message from '../models/Message';
import { getIO } from '../../socket';
import { User } from '../models/User';
import AppDataSource from '../config/typeorm';

exports.getMessages = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const messages = await Message.find();

        res.status(200).json({ messages });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

interface UserRequest extends Request {
    body: {
        content: string;
    },
    user: {
        userId: string;
        role: string;
    };
}

exports.createMessage = async (req: UserRequest, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: CustomError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    const content = req.body.content;
    const senderId = req.user.userId;

    try {

        const user = await AppDataSource.getRepository(User).findOne({ where: { id: senderId } });

        if (!user) {
            const error: CustomError = new Error('User not found.');
            error.statusCode = 404;
            return next(error);
        }

        const message = new Message({
            content: content,
            senderName: user.name,
            senderId: senderId,
            status: 'sent'
        });

        const savedMessage = await message.save();

        // websocket
        getIO().emit('messages', {
            action: 'create',
            message: {...(savedMessage as any)._doc }
        });

        res.status(201).json({ message: "Message created!", savedMessage: savedMessage });

    } catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
};

exports.isRead = async (req: Request, res: Response, next: NextFunction) => {
    
    const messageId = req.params.id;

    try {

        const message = await Message.findById(messageId);

        if (!message) {
            const error: CustomError = new Error('Message not found.');
            error.statusCode = 404;
            return next(error);
        }

        message.status = 'read';

        const updatedMessage = await message.save();

        // websocket
        getIO().emit('messages', {
            action: 'update',
            message: {...(updatedMessage as any)._doc }
        });

        res.status(200).json({ message: "Message read!", messageId: updatedMessage.id });

    }

    catch (err: any) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);

    }
}

export default exports;