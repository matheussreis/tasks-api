import dotenv from 'dotenv';
import express from 'express';
import { DBUtils } from './utils/database';
import { ProjectRouter, TaskRouter } from './routes';

dotenv.config();

const app = express();

app.use(express.json());

DBUtils.connect()
  .then(() => {
    console.log('Connected to the database.');

    app.use('/api/task', TaskRouter);
    app.use('/api/project', ProjectRouter);
  })
  .catch((error: Error) => {
    console.error('Failure connecting to the database.', error);
    process.exit();
  });

export default app;
