"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = __importDefault(require("./config/typeorm"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// middleware to parse json data:
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
// Error handling middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});
typeorm_1.default.initialize()
    .then(() => {
    console.log('Database connected!');
    app.listen(port, () => {
        console.log('Server running on port 3000');
    });
})
    .catch((error) => console.log('Database connection failed: ', error));
