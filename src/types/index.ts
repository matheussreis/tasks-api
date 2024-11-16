import { Collection } from 'mongodb';
import { ProjectModel, TasksModel } from '../models';

export type ProjectsCollection = Collection<ProjectModel>;

export type TasksCollection = Collection<TasksModel>;
