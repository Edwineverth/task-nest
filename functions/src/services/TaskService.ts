import 'reflect-metadata';
import { ITaskService } from '../interfaces/ITaskService';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../models/Task';
import { inject, injectable } from 'tsyringe';

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject('TaskRepository') private taskRepository: ITaskRepository
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async createTask(task: Task): Promise<Task> {
    return this.taskRepository.createTask(task);
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    await this.taskRepository.updateTask(taskId, task);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepository.deleteTask(taskId);
  }
}
