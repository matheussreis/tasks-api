import { ObjectId } from 'mongodb';

export default interface ProjectModel {
  _id: ObjectId;
  title: string;
  description: string;
  tasks: Array<ObjectId>;
  startDate: Date;
  dueDate: Date;
}
