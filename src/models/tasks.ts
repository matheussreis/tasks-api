import { ObjectId } from 'mongodb';

export enum StatusEnum {
  ToDo = 'to-do',
  Done = 'done',
}

export default interface TaskModel {
  _id: ObjectId;
  title: string;
  description: string;
  status: StatusEnum;
  startDate: Date;
  dueDate: Date;
  doneDate: Date | null | undefined;
}
