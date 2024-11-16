import express from 'express';
import { makeTaskController } from '../utils/factories';

const router = express.Router();

const taskController = makeTaskController();

router.get('/', (req, res) => taskController.list(req, res));

router.post('/', (req, res) => taskController.create(req, res));

router.put('/:id', (req, res) => taskController.update(req, res));

router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;
