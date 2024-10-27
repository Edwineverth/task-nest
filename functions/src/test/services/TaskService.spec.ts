import 'reflect-metadata';
import { TaskService } from '../../services/TaskService';
import { ITaskRepository } from '../../interfaces/ITaskRepository';
import { Task } from '../../models/Task';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    // Crear un mock para `TaskRepository`
    taskRepository = {
      getAllTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as jest.Mocked<ITaskRepository>;

    taskService = new TaskService(taskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return a list of tasks', async () => {
      const mockTasks: Task[] = [
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
      taskRepository.getAllTasks.mockResolvedValue(mockTasks);

      const tasks = await taskService.getAllTasks();

      expect(tasks).toEqual(mockTasks);
      expect(taskRepository.getAllTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTask', () => {
    it('should create and return the new task', async () => {
      const newTask: Task = {
        id: '3',
        title: 'New Task',
        description: 'New Description',
        userId: 'user3',
        completed: false,
      };
      taskRepository.createTask.mockResolvedValue(newTask);

      const task = await taskService.createTask(newTask);

      expect(task).toEqual(newTask);
      expect(taskRepository.createTask).toHaveBeenCalledWith(newTask);
      expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const updatedData: Partial<Task> = {
        title: 'Updated Task',
        completed: true,
      };

      await taskService.updateTask(taskId, updatedData);

      expect(taskRepository.updateTask).toHaveBeenCalledWith(
        taskId,
        updatedData
      );
      expect(taskRepository.updateTask).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const taskId = '1';

      await taskService.deleteTask(taskId);

      expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
      expect(taskRepository.deleteTask).toHaveBeenCalledTimes(1);
    });
  });
});
