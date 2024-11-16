import CoreService from './core';
import { ObjectId } from 'mongodb';
import { ProjectsModel } from '../models';
import { DBUtils } from '../utils/database';

export default class ProjectService implements CoreService<ProjectsModel> {
  private async getProjectCollection() {
    return await DBUtils.getCollection<ProjectsModel>('projects');
  }

  async create(project: ProjectsModel) {
    const collection = await this.getProjectCollection();

    project.startDate = new Date(project.startDate);
    project.dueDate = new Date(project.dueDate);

    await collection.insertOne(project);

    return project;
  }

  async list(limit: number = 15, offset: number = 0) {
    const collection = await this.getProjectCollection();
    const projects = await collection
      .find()
      .skip(offset)
      .limit(limit)
      .toArray();

    return projects;
  }

  async update(project: ProjectsModel) {
    const collection = await this.getProjectCollection();

    const existingProject = await collection.findOne({ _id: project._id });

    const updatedProject = {
      ...existingProject,
      ...project,
    } as ProjectsModel;

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
