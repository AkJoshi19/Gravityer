export interface Todo {
  id: string;
  apiId?: number;
  todo: string;
  completed: boolean;
  userId: number;
}
export type FilterType = 'all' | 'completed' | 'pending';