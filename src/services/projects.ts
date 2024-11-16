import { ObjectId } from 'mongodb';
import { CoreService } from './core';
import { DBUtils } from '../utils/database';
import { ProjectModel, TaskModel } from '../models';

export default class ProjectService implements CoreService<ProjectModel> {
  private async getProjectCollection() {
    return await DBUtils.getCollection<ProjectModel>('projects');
  }

  private async getTaskCollection() {
    return await DBUtils.getCollection<TaskModel>('tasks');
  }

  async create(project: ProjectModel) {
    const collection = await this.getProjectCollection();

    project.startDate = new Date(project.startDate);
    project.dueDate = new Date(project.dueDate);

    await collection.insertOne(project);

    return project;
  }

  async getById(id: ObjectId) {
    const collection = await this.getProjectCollection();
    return await collection.findOne({ _id: id });
  }

  async list({ limit = 15, offset = 0, filter = {}, orderBy }) {
    const collection = await this.getProjectCollection();
    const projects = await collection
      .find(filter)
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

  async remove(projectId: ObjectId) {
    const collection = await this.getProjectCollection();
    await collection.findOneAndDelete({ _id: projectId });
  }

  async exists(projectId: ObjectId) {
    const collection = await this.getProjectCollection();
    const project = await collection.findOne({ _id: projectId });
    return !!project;
  }

  async getTasksByProject({ limit = 15, offset = 0, orderBy, filter }) {
    const taskCollection = await this.getTaskCollection();

    filter = { ...filter, tasks: { $exists: true, $ne: [] } };
    const projects = await this.list({ limit, offset, filter, orderBy });

    const relatedTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await taskCollection
          .find({ _id: { $in: project.tasks } })
          .toArray();

        return {
          [project._id.toString()]: {
            title: project.title,
            tasks: tasks,
          },
        };
      })
    );

    const reshapedResult = relatedTasks.reduce((acc, projectTasks) => {
      return { ...acc, ...projectTasks };
    }, {});

    return reshapedResult;
  }
}
