import { ObjectId } from 'mongodb';

export default interface ProjectsModel {
  _id: ObjectId;
  title: string;
  description: string;
  tasks: Array<ObjectId>;
  startDate: Date;
  dueDate: Date;
}
