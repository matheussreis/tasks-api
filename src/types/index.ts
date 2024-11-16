import { Collection } from 'mongodb';
import { TasksModel } from '../models';

export type TasksCollection = Collection<TasksModel>;
