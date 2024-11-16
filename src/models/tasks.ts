import { ObjectId } from 'mongodb';

export default interface TaskModel {
  _id: ObjectId;
  title: string;
  description: string;
  status: 'to-do' | 'done';
  startDate: Date;
  dueDate: Date;
  doneDate: Date | null | undefined;
}
