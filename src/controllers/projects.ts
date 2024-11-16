import { ObjectId } from 'mongodb';
import { ProjectModel } from '../models';
import { OrderBy } from '../services/core';
import { Request, Response } from 'express';
import { ProjectService, TaskService } from '../services';
import { CoreValidator } from '../validators/core';

type ProjectOrderBy = OrderBy & {
  fields: 'startDate' | 'dueDate';
};

export default class ProjectController {
  private projectService: ProjectService;
  private taskService: TaskService;
  private validator: CoreValidator;

  constructor(
    taskService: TaskService,
    projectService: ProjectService,
    validator: CoreValidator
  ) {
    this.taskService = taskService;
    this.projectService = projectService;
    this.validator = validator;
  }

  async create(req: Request, res: Response) {
    try {
      const newProject = req.body.project as ProjectModel;

      const { status, message } = await this.validator.validate(newProject);

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      newProject.tasks = newProject.tasks.map((taskId) => new ObjectId(taskId));

      const project = await this.projectService.create(newProject);
      res.status(status).json({ ...project });
    } catch (error) {
      res.status(500).json({ message: 'Error creating project.' });
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

      if (title && title.length > 0) {
        filter = { title: { $regex: new RegExp(title, 'i') } };
      }

      const orderBy = {
        field: by,
        order: order,
      } as ProjectOrderBy;

      const projects = await this.projectService.list({
        limit,
        offset,
        orderBy,
        filter,
      });

      res.status(200).json({
        count: projects.length,
        projects: [...projects],
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (ObjectId.isValid(req.params.id) === false) {
        res.status(400).json({ message: 'Invalid Project ID.' });
        return;
      }

      const projectToUpdate = {
        _id: new ObjectId(req.params.id),
        ...(req.body.project ?? {}),
      };

      const { status, message } = await this.validator.validate(
        projectToUpdate,
        true
      );

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      const project = await this.projectService.update(projectToUpdate);

      res.status(200).json({ ...project });
    } catch (error) {
      res.status(500).json({ message: 'Error updating project.' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const projectId = req.params.id;

      if (ObjectId.isValid(projectId) === false) {
        res.status(400).json({ message: 'Invalid Project ID.' });
        return;
      }

      await this.projectService.remove(new ObjectId(projectId));

      res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project.' });
    }
  }

  async findTasksByProject(req: Request, res: Response) {
    try {
      let filter = {};
      const title = req?.query.title && `${req.query.title}`.trim();
      const limit = Number(req?.query.limit ?? 15);
      const offset = Number(req?.query.offset ?? 0);
      const order = req?.query.order ?? 'desc';
      const by = req?.query.by ?? 'startDate';

      if (!title) {
        res.status(400).json({ message: 'The project title is required.' });
        return;
      }

      filter = { title: { $regex: new RegExp(title, 'i') } };

      const orderBy = {
        field: by,
        order: order,
      } as ProjectOrderBy;

      const tasks = await this.projectService.getTasksByProject({
        limit,
        offset,
        orderBy,
        filter,
      });

      res.status(200).json({ ...tasks });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects.' });
    }
  }

  async assignTask(req: Request, res: Response) {
    try {
      const { taskId, id: projectId } = req.params;

      if (!ObjectId.isValid(taskId) || !ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Invalid Task or Project ID.' });
        return;
      }

      const taskObjectId = new ObjectId(taskId);
      const projectObjectId = new ObjectId(projectId);

      const project = await this.projectService.getById(projectObjectId);
      if (!project) {
        res.status(404).json({ message: 'Project not found.' });
        return;
      }

      const taskExists = await this.taskService.exists(taskObjectId);
      if (!taskExists) {
        res.status(404).json({ message: 'Task not found.' });
        return;
      }

      const duplicatedTask = project.tasks.some((task) =>
        task.equals(taskObjectId)
      );

      if (duplicatedTask) {
        res.status(200).json({
          message: 'Task is already assigned to this project.',
        });
        return;
      }

      project.tasks.push(taskObjectId);
      const updatedProject = await this.projectService.update(project);

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning task to project.' });
    }
  }
}
