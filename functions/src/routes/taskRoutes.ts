import 'reflect-metadata';
import { Router } from 'express';
import { container } from 'tsyringe';
import { TaskController } from '../controllers/TaskController';
import { ITaskService } from '../interfaces/ITaskService';
import { authenticatorMiddleware } from '../middleware/authenticator';
import { validateRequest } from '../middleware/validateRequest';
import { taskSchema } from '../validators/taskValidator';

const router = Router();
const taskService = container.resolve<ITaskService>('TaskService');
const taskController = new TaskController(taskService);

router.get('/tasks', authenticatorMiddleware, (req, res) =>
  taskController.getAllTasks(req, res)
);
router.post(
  '/tasks',
  authenticatorMiddleware,
  validateRequest(taskSchema),
  (req, res) => taskController.createTask(req, res)
);
router.put(
  '/tasks/:taskId',
  authenticatorMiddleware,
  validateRequest(taskSchema),
  (req, res) => taskController.updateTask(req, res)
);
router.delete('/tasks/:taskId', authenticatorMiddleware, (req, res) =>
  taskController.deleteTask(req, res)
);

export default router;
