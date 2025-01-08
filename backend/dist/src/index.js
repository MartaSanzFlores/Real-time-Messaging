"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = require("../swagger");
const typeorm_1 = __importDefault(require("./config/typeorm"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../socket");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const app = (0, express_1.default)();
const port = 3000;
// middleware to parse json data:
app.use(body_parser_1.default.json());
// Setup Swagger documentation
(0, swagger_1.setupSwagger)(app);
// CORS middleware
app.use((req, res, next) => {
    // Allow all origins with the wildcard '*'
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allow the following headers:
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Allow the following methods:
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/messages', messageRoutes_1.default);
// Error handling middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});
// Server connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/mydatabase';
mongoose_1.default.connect(mongoUrl) // MongoDB connection
    .then(() => {
    console.log('MongoDB connected');
    // PostgreSQL connection
    typeorm_1.default.initialize()
        .then(() => {
        console.log('PostgreSQL connected!');
        // Start server
        const server = app.listen(port, () => {
            console.log('Server running on port ' + port);
        });
        //Socket.io
        const io = (0, socket_1.initIO)(server);
        io.on('connection', socket => {
            console.log('Client connected');
        });
    })
        .catch((error) => console.log('Database connection failed: ', error));
})
    .catch((error) => {
    console.error('MongoDB connection failed: ', error);
    process.exit(1);
});
