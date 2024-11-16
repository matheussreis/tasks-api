import { ObjectId } from 'mongodb';

export default interface CoreService<Model> {
  create(model: Model): Promise<Model>;
  list(limit: number, offset: number): Promise<Array<Model>>;
  update(model: Model): Promise<Model>;
  delete(id: ObjectId): Promise<void>;
  exists(id: ObjectId): Promise<boolean>;
}
