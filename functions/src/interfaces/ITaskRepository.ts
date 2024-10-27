import { Task } from '../models/Task';

export interface ITaskRepository {
  getAllTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  updateTask(taskId: string, task: Partial<Task>): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}
