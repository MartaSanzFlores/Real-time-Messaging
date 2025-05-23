import express from 'express';
import { setupSwagger } from '../swagger';
import { Request, Response, NextFunction } from 'express';
import AppDataSource from './config/typeorm';
import bodyParser from 'body-parser';
import { CustomError } from './types/error';
import mongoose from 'mongoose';
import { initIO } from '../socket';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();
const port = 3000;

// middleware to parse json data:
app.use(bodyParser.json());

// Setup Swagger documentation
setupSwagger(app);

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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/messages', messageRoutes);

// Error handling middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

// Server connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chat';
mongoose.connect(mongoUrl) // MongoDB connection
  .then(() => {
    console.log('MongoDB connected'); 

    // PostgreSQL connection
    AppDataSource.initialize()
      .then(() => {
        console.log('PostgreSQL connected!');
        // Start server
        const server = app.listen(port, () => {
          console.log('Server running on port ' + port);
        });
        //Socket.io
        const io = initIO(server);
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