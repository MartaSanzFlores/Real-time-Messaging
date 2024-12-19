import express from 'express';
import { Request, Response, NextFunction } from 'express';
import AppDataSource from './config/typeorm';
import bodyParser from 'body-parser';
import { CustomError } from './types/error';
import mongoose from 'mongoose';

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

// Connexion à MongoDB avec Mongoose
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/mydatabase'; // L'URL de connexion à MongoDB (elle devrait être définie dans votre .env)
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('MongoDB connected');  // Affichage du message si MongoDB est connecté

    // Connexion à PostgreSQL avec TypeORM
    AppDataSource.initialize()
      .then(() => {
        console.log('PostgreSQL connected!');
        // Lancer le serveur une fois que les connexions sont réussies
        app.listen(port, () => {
          console.log('Server running on port 3000');
        });
      })
      .catch((error) => console.log('Database connection failed: ', error));
  })
  .catch((error) => {
    console.error('MongoDB connection failed: ', error);
    process.exit(1); // Quitte le processus en cas d'échec de la connexion à MongoDB
  });