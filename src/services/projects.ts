import { ObjectId } from 'mongodb';
import { ProjectModel } from '../models';
import { DBUtils } from '../utils/database';
import { CoreService, OrderBy } from './core';

export default class ProjectService implements CoreService<ProjectModel> {
  private async getProjectCollection() {
    return await DBUtils.getCollection<ProjectModel>('projects');
  }

  async create(project: ProjectModel) {
    const collection = await this.getProjectCollection();

    project.startDate = new Date(project.startDate);
    project.dueDate = new Date(project.dueDate);

    await collection.insertOne(project);

    return project;
  }

  async list(limit: number = 15, offset: number = 0, orderBy: OrderBy) {
    const collection = await this.getProjectCollection();
    const projects = await collection
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ [orderBy.field]: orderBy.order === 'desc' ? -1 : 1 })
      .toArray();

    return projects;
  }

  async update(project: ProjectModel) {
    const collection = await this.getProjectCollection();

    const existingProject = await collection.findOne({ _id: project._id });

    const updatedProject = {
      ...existingProject,
      ...project,
    } as ProjectModel;

    updatedProject.startDate = new Date(updatedProject.startDate);
    updatedProject.dueDate = new Date(updatedProject.dueDate);

    await collection.updateOne({ _id: project._id }, { $set: updatedProject });

    return updatedProject;
  }

  async delete(projectId: ObjectId) {
    const collection = await this.getProjectCollection();
    await collection.findOneAndDelete({ _id: projectId });
  }

  async exists(projectId: ObjectId) {
    const collection = await this.getProjectCollection();
    const project = await collection.findOne({ _id: projectId });
    return !!project;
  }
}
