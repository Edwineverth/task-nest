import admin from 'firebase-admin';

export interface User {
  id?: string;
  email: string;
  password: string;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
