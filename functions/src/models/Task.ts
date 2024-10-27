import admin from 'firebase-admin';

export interface Task {
  id?: string;
  title: string;
  description: string;
  userId: string;
  completed: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
