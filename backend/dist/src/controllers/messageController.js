"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Message_1 = __importDefault(require("../models/Message"));
const socket_1 = require("../../socket");
const User_1 = require("../models/User");
const typeorm_1 = __importDefault(require("../config/typeorm"));
exports.getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find();
        res.status(200).json({ messages });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    const content = req.body.content;
    const senderId = req.user.userId;
    try {
        const user = yield typeorm_1.default.getRepository(User_1.User).findOne({ where: { id: senderId } });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            return next(error);
        }
        const message = new Message_1.default({
            content: content,
            senderName: user.name,
            senderId: senderId,
            status: 'sent'
        });
        const savedMessage = yield message.save();
        // websocket
        (0, socket_1.getIO)().emit('messages', {
            action: 'create',
            message: Object.assign({}, savedMessage._doc)
        });
        res.status(201).json({ message: "Message created!", savedMessage: savedMessage });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.isRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.id;
    try {
        const message = yield Message_1.default.findById(messageId);
        if (!message) {
            const error = new Error('Message not found.');
            error.statusCode = 404;
            return next(error);
        }
        message.status = 'read';
        const updatedMessage = yield message.save();
        // websocket
        (0, socket_1.getIO)().emit('messages', {
            action: 'update',
            message: Object.assign({}, updatedMessage._doc)
        });
        res.status(200).json({ message: "Message read!", messageId: updatedMessage.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.default = exports;
