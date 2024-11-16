import { ObjectId } from 'mongodb';
import { TaskService } from '../services';
import { OrderBy } from '../services/core';
import { Request, Response } from 'express';
import { StatusEnum } from '../models/tasks';
import { CoreValidator } from '../validators/core';
import { TaskValidator } from '../validators';

type TaskOrderBy = OrderBy & {
  fields: 'startDate' | 'doneDate' | 'dueDate';
};

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
      let filter = {};
      const title = req?.query.title && `${req.query.title}`.trim();
      const limit = Number(req?.query.limit ?? 15);
      const offset = Number(req?.query.offset ?? 0);
      const order = req?.query.order ?? 'desc';
      const by = req?.query.by ?? 'startDate';
      const status = req?.query.status && `${req.query.status}`.trim();

      if (title && title.length > 0) {
        filter = { title: { $regex: new RegExp(title, 'i') } };
      }

      if (status && status.length > 0) {
        const statusValidation = TaskValidator.checkStatus(
          status as StatusEnum
        );

        if (statusValidation) {
          res.status(statusValidation.status).json({
            message: statusValidation.message,
          });
          return;
        }

        filter = { status: { $eq: status } };
      }

      const orderBy = {
        field: by,
        order: order,
      } as TaskOrderBy;

      const tasks = await this.service.list({ limit, offset, orderBy, filter });
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

      const taskToUpdate = {
        _id: new ObjectId(req.params.id),
        ...(req.body.task ?? {}),
      };

      const { status, message } = await this.validator.validate(
        taskToUpdate,
        true
      );

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      const task = await this.service.update(taskToUpdate);

      res.status(200).json({ ...task });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const taskId = req.params.id;

      if (ObjectId.isValid(taskId) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
        return;
      }

      await this.service.remove(new ObjectId(taskId));

      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const status = req.params.status as StatusEnum;

      if (ObjectId.isValid(req.params.id) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
        return;
      }

      const statusValidation = TaskValidator.checkStatus(status as StatusEnum);
      if (statusValidation) {
        res.status(statusValidation.status).json({
          message: statusValidation.message,
        });
        return;
      }

      const taskId = new ObjectId(req.params.id);
      const task = await this.service.getById(taskId);
      if (!task) {
        res.status(404).json({
          message: 'Task not found',
        });
        return;
      }

      task.status = status;
      const updatedTask = await this.service.update(task);
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task status' });
    }
  }
}
