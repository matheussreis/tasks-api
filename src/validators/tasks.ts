import { TaskModel } from '../models';
import { TaskService } from '../services';
import CommonValidator from './common';
import { CoreValidator, ValidatorResult } from './core';

export default class TaskValidator implements CoreValidator {
  private service: TaskService;

  private validFields = [
    '_id',
    'title',
    'description',
    'status',
    'startDate',
    'dueDate',
  ];

  constructor(service: TaskService) {
    this.service = service;
  }

  async validate(
    task: TaskModel,
    isUpdate: boolean = false
  ): Promise<ValidatorResult> {
    if (!task) {
      return {
        status: 400,
        message: 'Parameter "task" is required.',
      };
    }

    const fieldValidation = CommonValidator.checkCollectionFields<TaskModel>(
      this.validFields,
      task
    );

    if (fieldValidation) return { ...fieldValidation };

    if (isUpdate) {
      return CommonValidator.checkExistingRecordOnUpdate<TaskModel>(
        this.service,
        task._id
      );
    }

    if (task.status !== 'to-do' && task.status !== 'done') {
      return {
        status: 400,
        message: 'Status must be either "to-do" or "done"',
      };
    }

    const requiredFieldErrors = [
      CommonValidator.validateRequiredField(task.title, 'Title'),
      CommonValidator.validateRequiredField(task.description, 'Description'),
    ].find((error) => error !== null);
    if (requiredFieldErrors) return requiredFieldErrors;

    const dateFieldErrors = [
      CommonValidator.validateDateField(task.startDate, 'Start date'),
      CommonValidator.validateDateField(task.dueDate, 'Due date'),
    ].find((error) => error !== null);
    if (dateFieldErrors) return dateFieldErrors;

    return {
      status: 200,
    };
  }
}
