import 'reflect-metadata';
import { Request, Response } from 'express';
import { TaskController } from '../../controllers/TaskController';
import { ITaskService } from '../../interfaces/ITaskService';
import { Task } from '../../models/Task';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<ITaskService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Mock del servicio de tareas
    taskService = {
      getAllTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as jest.Mocked<ITaskService>;

    taskController = new TaskController(taskService);

    // Mock de Request y Response
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return a list of tasks', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          userId: 'user1',
          completed: false,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          userId: 'user2',
          completed: true,
        },
      ];
      taskService.getAllTasks.mockResolvedValue(tasks);

      await taskController.getAllTasks(req as Request, res as Response);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it('should handle errors and return 500', async () => {
      taskService.getAllTasks.mockRejectedValue(
        new Error('Error fetching tasks')
      );

      await taskController.getAllTasks(req as Request, res as Response);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching tasks',
      });
    });
  });

  describe('createTask', () => {
    it('should create a new task and return it', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        userId: 'user1',
        completed: false,
      };
      const createdTask = { ...newTask, id: '1' };
      req.body = newTask;
      taskService.createTask.mockResolvedValue(createdTask);

      await taskController.createTask(req as Request, res as Response);

      expect(taskService.createTask).toHaveBeenCalledWith(newTask);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it('should handle errors and return 400', async () => {
      req.body = {
        title: 'New Task',
        description: 'New Description',
        userId: 'user1',
        completed: false,
      };
      taskService.createTask.mockRejectedValue(
        new Error('Task creation failed')
      );

      await taskController.createTask(req as Request, res as Response);

      expect(taskService.createTask).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task creation failed',
      });
    });
  });
  describe('updateTask', () => {
    it('should update an existing task and return a success message', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };

      await taskController.updateTask(req as Request, res as Response);

      expect(taskService.updateTask).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Task updated successfully',
      });
    });
    it('should handle errors and return 400', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };
      taskService.updateTask.mockRejectedValue(new Error('Update failed'));

      await taskController.updateTask(req as Request, res as Response);

      expect(taskService.updateTask).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });

    describe('deleteTask', () => {
      it('should delete an existing task and return a success message', async () => {
        req.params = { taskId: '1' };

        await taskController.deleteTask(req as Request, res as Response);

        expect(taskService.deleteTask).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Task deleted successfully',
        });
      });

      it('should handle errors and return 400', async () => {
        req.params = { taskId: '1' };
        taskService.deleteTask.mockRejectedValue(new Error('Delete failed'));

        await taskController.deleteTask(req as Request, res as Response);

        expect(taskService.deleteTask).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
      });
    });
  });
});
