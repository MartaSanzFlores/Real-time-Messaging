"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const typeorm_1 = __importDefault(require("./config/typeorm"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
// middleware to parse json data:
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
typeorm_1.default.initialize()
    .then(() => {
    console.log('Database connected!');
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
})
    .catch((error) => console.log('Database connection failed: ', error));
