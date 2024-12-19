import express from 'express';
import { Request, Response, NextFunction } from 'express';
import AppDataSource from './config/typeorm';
import bodyParser from 'body-parser';
import { CustomError } from './types/error';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const port = 3000;

// middleware to parse json data:
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(port, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((error) => console.log('Database connection failed: ', error));