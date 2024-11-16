import { ObjectId } from 'mongodb';
import { ProjectsModel } from '../models';
import { Request, Response } from 'express';
import { ProjectService } from '../services';
import { CoreValidator } from '../validators/core';

export default class ProjectController {
  private service: ProjectService;
  private validator: CoreValidator;

  constructor(service: ProjectService, validator: CoreValidator) {
    this.service = service;
    this.validator = validator;
  }

  async create(req: Request, res: Response) {
    try {
      const newProject = req.body.project as ProjectsModel;

      const { status, message } = await this.validator.validate(newProject);

      if (status > 200) {
        res.status(status).json({ message });
        return;
      }

      newProject.tasks = newProject.tasks.map((taskId) => new ObjectId(taskId));

      const project = await this.service.create(newProject);
      res.status(status).json({ ...project });
    } catch (error) {
      res.status(500).json({ message: 'Error creating project.' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const limit = Number(req?.query.limit ?? 15);
      const offset = Number(req?.query.offset ?? 0);
      const projects = await this.service.list(limit, offset);
      res
        .status(200)
        .json({ count: projects.length, projects: { ...projects } });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (ObjectId.isValid(req.params.id) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
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

      const project = await this.service.update(projectToUpdate);

      res.status(200).json({ ...project });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const projectId = req.params.id;

      if (ObjectId.isValid(projectId) === false) {
        res.status(400).json({ message: 'Invalid Task ID.' });
        return;
      }

      await this.service.delete(new ObjectId(projectId));

      res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting project.' });
    }
  }
}
