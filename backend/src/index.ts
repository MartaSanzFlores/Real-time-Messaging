import express from 'express';
require('dotenv').config();
import AppDataSource from './config/typeorm';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// middleware to parse json data:
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((error) => console.log('Database connection failed: ', error));