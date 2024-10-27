import { Request, Response } from 'express';
import { ITaskService } from '../interfaces/ITaskService';
import { inject } from 'tsyringe';

export class TaskController {
  constructor(@inject('TaskService') private taskService: ITaskService) {}

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const { title, description, userId, completed } = req.body;
      const newTask = await this.taskService.createTask({
        title,
        description,
        userId,
        completed,
      });
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const data = req.body;
      await this.taskService.updateTask(taskId, data);
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      await this.taskService.deleteTask(taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
