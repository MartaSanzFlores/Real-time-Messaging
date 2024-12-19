import { DataSource } from 'typeorm';
import { User } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase',
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
