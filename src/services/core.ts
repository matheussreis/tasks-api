import { ObjectId } from 'mongodb';

export type OrderBy = {
  field: string;
  order: 'desc' | 'asc';
};

export interface CoreService<Model> {
  create(model: Model): Promise<Model>;
  list(limit: number, offset: number, orderBy: OrderBy): Promise<Array<Model>>;
  update(model: Model): Promise<Model>;
  remove(id: ObjectId): Promise<void>;
  exists(id: ObjectId): Promise<boolean>;
}
