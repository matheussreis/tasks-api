import { ObjectId } from 'mongodb';

export type OrderBy = {
  field: string;
  order: 'desc' | 'asc';
};

export type ListParams = {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  filter: Record<string, any> | undefined;
};

export interface CoreService<Model> {
  create(model: Model): Promise<Model>;
  list(params: ListParams): Promise<Array<Model>>;
  update(model: Model): Promise<Model>;
  remove(id: ObjectId): Promise<void>;
  exists(id: ObjectId): Promise<boolean>;
}
