"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../controllers/messageController"));
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/', authMiddleware_1.default, messageController_1.default.getMessages);
router.post('/createMessage', authMiddleware_1.default, [
    (0, express_validator_1.body)('content')
        .trim()
        .isString()
        .isLength({ min: 1 })
], messageController_1.default.createMessage);
router.patch('/isRead/:id', authMiddleware_1.default, messageController_1.default.isRead);
exports.default = router;
