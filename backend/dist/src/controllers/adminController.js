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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const users = yield userRepository.find();
        const usersWithoutPassword = users.map(user => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
        res.status(200).json({ users: usersWithoutPassword });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json({ user: userWithoutPassword });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const role = req.body.role;
    try {
        const hashedPW = yield bcryptjs_1.default.hash(password, 12);
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const user = userRepository.create({
            name: name,
            email: email,
            password: hashedPW,
            role: role
        });
        const result = yield userRepository.save(user);
        res.status(201).json({ message: "User created by admin!", userId: result.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    const currentUserId = req.user.userId;
    const userId = req.params.id;
    const newName = req.body.name;
    const newEmail = req.body.email;
    let newPassword = req.body.password;
    const newRole = req.body.role;
    try {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        if (newPassword === '') {
            newPassword = user.password;
        }
        else {
            if (newPassword.length < 5) {
                const error = new Error('Password must be at least 5 characters long.');
                error.statusCode = 422;
                throw error;
            }
            const hashedPW = yield bcryptjs_1.default.hash(newPassword, 12);
            user.password = hashedPW;
        }
        user.name = newName;
        user.email = newEmail;
        if (currentUserId == userId && newRole && newRole != user.role) {
            const error = new Error('You cannot change your own role.');
            error.statusCode = 403;
            throw error;
        }
        else if (newRole) {
            user.role = newRole;
        }
        const result = yield userRepository.save(user);
        res.status(200).json({ message: "User updated!", userId: result.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const currentUserId = req.user.userId;
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        if (currentUserId == userId) {
            const error = new Error('You cannot delete your own user.');
            error.statusCode = 403;
            throw error;
        }
        const result = yield userRepository.remove(user);
        res.status(200).json({ message: "User deleted!", userId: result.id });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.default = exports;
