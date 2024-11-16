import { ObjectId } from 'mongodb';
import { ProjectModel } from '../models';
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

  private async checkRelatedTasks(project: ProjectModel) {
    const projectId: ObjectId = project._id;
    const taskIds: Array<ObjectId> = project.tasks;

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

      const belongsToAnotherProject =
        await this.taskService.belongsToAnotherProject(taskObjId, projectId);
      if (belongsToAnotherProject) {
        return {
          status: 400,
          message: `Related task is already assigned to a different project.`,
        };
      }
    }

    return null;
  }

  async validate(
    project: ProjectModel,
    isUpdate: boolean = false
  ): Promise<ValidatorResult> {
    if (!project) {
      return {
        status: 400,
        message: 'Parameter "project" is required.',
      };
    }

    const fieldValidation = CommonValidator.checkCollectionFields<ProjectModel>(
      this.validFields,
      project
    );

    if (fieldValidation) return { ...fieldValidation };

    const relatedTasksValidation = await this.checkRelatedTasks(project);
    if (relatedTasksValidation) return relatedTasksValidation;

    if (isUpdate) {
      return CommonValidator.checkExistingRecordOnUpdate<ProjectModel>(
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
      CommonValidator.validateDateField(project.startDate, 'Start date'),
      CommonValidator.validateDateField(project.dueDate, 'Due date'),
    ].find((error) => error !== null);
    if (dateFieldErrors) return dateFieldErrors;

    return {
      status: 200,
    };
  }
}
