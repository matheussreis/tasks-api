import { TasksModel } from '../models';
import TaskService from '../services/tasks';
import { CoreValidator, ValidatorResult } from './core';

export default class TaskValidator implements CoreValidator {
  private service: TaskService;

  private validFields = [
    'title',
    'description',
    'status',
    'startDate',
    'dueDate',
  ];

  private isValidDate(date: Date) {
    return !isNaN(date.getTime());
  }

  constructor(service: TaskService) {
    this.service = service;
  }

  async validate(
    task: TasksModel,
    isUpdate: boolean = false
  ): Promise<ValidatorResult> {
    if (!task) {
      return {
        status: 400,
        message: 'Parameter "task" is required.',
      };
    }

    const invalidFields = Object.keys(task).filter(
      (key) => !this.validFields.includes(key)
    );

    if (invalidFields.length > 0) {
      return {
        status: 400,
        message: `Invalid fields provided: ${invalidFields.join(', ')}`,
      };
    }

    if (isUpdate === true) {
      const exists = await this.service.exists(task._id);
      if (exists === false) {
        return {
          status: 404,
          message: 'Task not found.',
        };
      }

      return {
        status: 200,
      };
    }

    if (!task.title || `${task.title}`.trim().length === 0) {
      return {
        status: 400,
        message: 'Title is required.',
      };
    }

    if (!task.description || `${task.description}`.trim().length === 0) {
      return {
        status: 400,
        message: 'Description is required.',
      };
    }

    if (task.status !== 'to-do' && task.status !== 'done') {
      return {
        status: 400,
        message: 'Status must be either "to-do" or "done"',
      };
    }

    const startDate = new Date(task?.startDate);
    if (this.isValidDate(startDate) === false) {
      return {
        status: 400,
        message: 'Invalid start date for task.',
      };
    }

    const dueDate = new Date(task?.dueDate);
    if (this.isValidDate(dueDate) === false) {
      return {
        status: 400,
        message: 'Invalid due date for task.',
      };
    }

    return {
      status: 200,
    };
  }
}
