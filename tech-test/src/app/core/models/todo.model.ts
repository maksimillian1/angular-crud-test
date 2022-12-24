import { BaseModel } from './base-model.interface';

export interface TodoModel extends BaseModel {
  id: number;
  description: string;
  label: string;
  category: string;
  done: string | null;
}

export enum TodoCategory {
  HOME = 'home',
  TO_BUY = 'to_buy',
  IMPORTANT = 'important',
}

export enum TodoCategoryLabel {
  HOME = 'Home',
  TO_BUY = 'To buy',
  IMPORTANT = 'Important',
}
