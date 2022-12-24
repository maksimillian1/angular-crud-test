import { BaseModel } from './base-model.interface';

export interface TodoModel extends BaseModel {
  id: number;
  description: string;
  label: string;
  category: string;
  done: string | null;
}

export enum TodoCategory {
  HOME_ASSIGNMENTS = '',
  TO_CELL = '',
  TO_BUY = '',
  NEW_YEAR_PLANNING = '',
}
