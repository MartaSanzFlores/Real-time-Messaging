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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const typeorm_1 = __importDefault(require("../config/typeorm"));
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hashedPW = yield bcryptjs_1.default.hash(password, 12);
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const [users, usersCount] = yield userRepository.findAndCount();
        const userRole = usersCount === 0 ? "admin" : "user";
        const user = userRepository.create({
            name: name,
            email: email,
            password: hashedPW,
            role: userRole
        });
        const result = yield userRepository.save(user);
        res.status(201).json({ message: "User created!", userId: result.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOneBy({ email: email });
        let loadedUser;
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = yield bcryptjs_1.default.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser.id,
            role: loadedUser.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "User logged in!", token: token, userId: loadedUser.id, role: loadedUser.role });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.default = exports;
