import { ObjectId } from 'mongodb';
import TaskService from '../services/tasks';
import { Request, Response } from 'express';
import { CoreValidator } from '../validators/core';

export default class TaskController {
  private service: TaskService;
  private validator: CoreValidator;

  constructor(service: TaskService, validator: CoreValidator) {
    this.service = service;
    this.validator = validator;
  }

  async create(req: Request, res: Response) {
    try {
      const newTask = req.body.task;

      const { status, message } = await this.validator.validate(newTask);

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      const task = await this.service.create(newTask);
      res.status(status).json({ ...task });
    } catch (error) {
      res.status(500).json({ message: 'Error creating task' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const limit = Number(req?.query.limit ?? 15);
      const offset = Number(req?.query.offset ?? 0);
      const tasks = await this.service.list(limit, offset);
      res.status(200).json({ count: tasks.length, tasks: { ...tasks } });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (ObjectId.isValid(req.params.id) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
        return;
      }

      const taskData = req.body.task ?? {};

      const { status, message } = await this.validator.validate(taskData, true);

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      const taskToUpdate = {
        _id: new ObjectId(req.params.id),
        ...taskData,
      };

      const task = await this.service.update(taskToUpdate);

      res.status(200).json({ ...task });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const taskId = req.params.id;

      if (ObjectId.isValid(taskId) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
        return;
      }

      await this.service.delete(new ObjectId(taskId));

      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  }
}