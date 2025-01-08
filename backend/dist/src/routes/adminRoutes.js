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
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const checkRoleMiddleware_1 = __importDefault(require("../middleware/checkRoleMiddleware"));
const express_validator_1 = require("express-validator");
const typeorm_1 = __importDefault(require("../config/typeorm"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *  name: Admin
 * description: Admin routes
 *  components:
 *   securitySchemes:
 *    bearerAuth:
 *    type: http
 *   scheme: bearer
 *  bearerFormat: JWT
 * security:
 * - bearerAuth: []
 *
 */
router.get('/getUsers', authMiddleware_1.default, checkRoleMiddleware_1.default, adminController_1.default.getUsers);
router.get('/getUser/:id', authMiddleware_1.default, checkRoleMiddleware_1.default, adminController_1.default.getUser);
router.post('/createUser', authMiddleware_1.default, [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const existingUser = yield userRepository.findOneBy({ email: value });
        if (existingUser) {
            throw new Error('E-Mail address already exists!');
        }
        return true;
    }))
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long.'),
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
], adminController_1.default.createUser);
router.put('/updateUser/:id', authMiddleware_1.default, checkRoleMiddleware_1.default, [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const userRepository = typeorm_1.default.getRepository(User_1.User);
        const existingUser = yield userRepository.findOneBy({ email: value });
        if (existingUser && (existingUser.id != req.params.id)) {
            throw new Error('E-Mail address already exists!');
        }
        return true;
    }))
        .normalizeEmail(),
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
], adminController_1.default.updateUser);
router.delete('/deleteUser/:id', authMiddleware_1.default, checkRoleMiddleware_1.default, adminController_1.default.deleteUser);
exports.default = router;
