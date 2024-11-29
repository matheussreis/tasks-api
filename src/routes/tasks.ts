import express from 'express';
import { makeTaskController } from '../utils/factories';

const router = express.Router();

const taskController = makeTaskController();

router.get('/', (req, res) => taskController.list(req, res));

router.get('/:id', (req, res) => taskController.getById(req, res));

router.post('/', (req, res) => taskController.create(req, res));

router.put('/:id', (req, res) => taskController.update(req, res));

router.put('/:id/change/:status', (req, res) =>
  taskController.updateStatus(req, res)
);

router.delete('/:id', (req, res) => taskController.remove(req, res));

export default router;
