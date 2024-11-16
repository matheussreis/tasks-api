import { ObjectId } from 'mongodb';
import { ProjectsModel } from '../models';
import { ProjectService, TaskService } from '../services';
import { CoreValidator, ValidatorResult } from './core';
import CommonValidator from './common';

export default class ProjectValidator implements CoreValidator {
  private taskService: TaskService;
  private projectService: ProjectService;

  constructor(projectService: ProjectService, taskService: TaskService) {
    this.projectService = projectService;
    this.taskService = taskService;
  }

  private validFields = [
    '_id',
    'title',
    'description',
    'startDate',
    'dueDate',
    'tasks',
  ];

  private async checkRelatedTasks(taskIds: Array<ObjectId>) {
    if (!taskIds) {
      return null;
    }

    if (taskIds.length === 0) {
      return null;
    }

    for (const taskId of taskIds) {
      if (ObjectId.isValid(taskId) === false) {
        return {
          status: 400,
          message: 'Invalid Task ID.',
        };
      }

      const taskObjId = new ObjectId(taskId);
      const doNotExist = (await this.taskService.exists(taskObjId)) === false;
      if (doNotExist) {
        return {
          status: 404,
          message: `Related task "${taskObjId.toString()}" not found.`,
        };
      }
    }

    return null;
  }

  async validate(
    project: ProjectsModel,
    isUpdate: boolean = false
  ): Promise<ValidatorResult> {
    if (!project) {
      return {
        status: 400,
        message: 'Parameter "project" is required.',
      };
    }

    const fieldValidation =
      CommonValidator.checkCollectionFields<ProjectsModel>(
        this.validFields,
        project
      );

    if (fieldValidation) return { ...fieldValidation };

    const relatedTasksValidation = await this.checkRelatedTasks(project.tasks);
    if (relatedTasksValidation) return relatedTasksValidation;

    if (isUpdate) {
      return CommonValidator.checkExistingRecordOnUpdate<ProjectsModel>(
        this.projectService,
        project._id
      );
    }

    const requiredFieldErrors = [
      CommonValidator.validateRequiredField(project.title, 'Title'),
      CommonValidator.validateRequiredField(project.description, 'Description'),
    ].find((error) => error !== null);
    if (requiredFieldErrors) return requiredFieldErrors;

    const dateFieldErrors = [
      CommonValidator.validateDateField(project.startDate, 'start date'),
      CommonValidator.validateDateField(project.dueDate, 'due date'),
    ].find((error) => error !== null);
    if (dateFieldErrors) return dateFieldErrors;

    return {
      status: 200,
    };
  }
}
