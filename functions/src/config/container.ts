import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { IUserService } from '../interfaces/IUserService';
import { ITaskService } from '../interfaces/ITaskService';
import { UserRepository } from '../repositories/UserRepository';
import { TaskRepository } from '../repositories/TaskRepository';
import { UserService } from '../services/UserService';
import { TaskService } from '../services/TaskService';

// Registro de Repositorios
container.register<IUserRepository>('UserRepository', {
  useClass: UserRepository,
});
container.register<ITaskRepository>('TaskRepository', {
  useClass: TaskRepository,
});

// Registro de Servicios
container.register<IUserService>('UserService', { useClass: UserService });
container.register<ITaskService>('TaskService', { useClass: TaskService });
