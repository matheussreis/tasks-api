import express from 'express';
import { makeProjectController } from '../utils/factories';

const router = express.Router();

const projectController = makeProjectController();

router.get('/', (req, res) => projectController.list(req, res));

router.post('/', (req, res) => projectController.create(req, res));

router.put('/:id', (req, res) => projectController.update(req, res));

router.delete('/:id', (req, res) => projectController.remove(req, res));

export default router;
