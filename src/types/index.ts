import { Collection } from 'mongodb';
import { ProjectModel, TaskModel } from '../models';

export type ProjectsCollection = Collection<ProjectModel>;

export type TasksCollection = Collection<TaskModel>;
