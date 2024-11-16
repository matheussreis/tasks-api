import { Collection } from 'mongodb';
import { ProjectsModel, TasksModel } from '../models';

export type ProjectsCollection = Collection<ProjectsModel>;

export type TasksCollection = Collection<TasksModel>;
