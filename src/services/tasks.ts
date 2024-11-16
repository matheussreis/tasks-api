import { ObjectId } from 'mongodb';
import CoreService from './core';
import { TaskModel } from '../models';
import { DBUtils } from '../utils/database';

export default class TaskService implements CoreService<TaskModel> {
  private async getTasksCollection() {
    return await DBUtils.getCollection<TaskModel>('tasks');
  }

  async create(task: TaskModel) {
    const collection = await this.getTasksCollection();

    task.startDate = new Date(task.startDate);
    task.dueDate = new Date(task.dueDate);
    task.doneDate = new Date(task.doneDate);

    await collection.insertOne(task);
    return task;
  }

  async list(limit: number = 15, offset: number = 0) {
    const collection = await this.getTasksCollection();
    const tasks = await collection.find().skip(offset).limit(limit).toArray();
    return tasks;
  }

  async update(task: TaskModel) {
    const collection = await this.getTasksCollection();

    const existingTask = await collection.findOne({ _id: task._id });

    const updatedTask = { ...existingTask, ...task } as TaskModel;

    updatedTask.startDate = new Date(updatedTask.startDate);
    updatedTask.dueDate = new Date(updatedTask.dueDate);
    updatedTask.doneDate = new Date(updatedTask.doneDate);

    await collection.updateOne({ _id: task._id }, { $set: updatedTask });

    return updatedTask;
  }

  async delete(taskId: ObjectId) {
    const collection = await this.getTasksCollection();
    await collection.findOneAndDelete({ _id: taskId });
  }

  async exists(taskId: ObjectId) {
    const collection = await this.getTasksCollection();
    const task = await collection.findOne({ _id: taskId });
    return !!task;
  }
}
