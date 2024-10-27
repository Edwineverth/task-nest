import 'reflect-metadata';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../models/Task';
import { db } from '../firebase/firebase';
import admin from 'firebase-admin';
import { injectable } from 'tsyringe';

@injectable()
export class TaskRepository implements ITaskRepository {
  async getAllTasks(): Promise<Task[]> {
    const tasksSnapshot = await admin.firestore().collection('tasks').get();
    const tasks: Task[] = [];

    tasksSnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,
        updatedAt: data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,
      } as Task);
    });

    return tasks;
  }

  async createTask(task: Task): Promise<Task> {
    const newTaskRef = db.collection('tasks').doc(); // Crear un nuevo documento con ID automático
    const newTask = {
      ...task,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newTaskRef.set(newTask);

    // Recuperar el documento para verificar los valores de createdAt y updatedAt
    const taskDoc = await newTaskRef.get();
    if (!taskDoc.exists) {
      throw new Error('La tarea no se creó correctamente.');
    }

    const taskData = taskDoc.data();
    return {
      id: newTaskRef.id,
      ...taskData,
    } as Task;
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    const taskRef = db.collection('tasks').doc(taskId);
    await taskRef.update({
      ...task,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = db.collection('tasks').doc(taskId);
    await taskRef.delete();
  }
}
