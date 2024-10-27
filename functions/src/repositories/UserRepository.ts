import 'reflect-metadata';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../models/User';
import { db } from '../firebase/firebase';
import admin from 'firebase-admin';
import { injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class UserRepository implements IUserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log(`No se encontró un usuario con el email: ${email}`);
      return null;
    }

    const userDoc = usersSnapshot.docs[0];
    const data = userDoc.data();

    return {
      ...data,
      id: userDoc.id,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null, // UTC
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null, // UTC
    } as User;
  }

  async createUser(user: User): Promise<void> {
    const userId = uuidv4(); // Genera un UUID
    const userRef = db.collection('users').doc(userId); // Usa el UUID como ID del documento

    await userRef.set({
      ...user,
      id: userId, // Asigna el UUID como el campo ID dentro del documento
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async updateUser(email: string, user: Partial<User>): Promise<void> {
    const userRef = db.collection('users').doc(email);
    await userRef.update({
      ...user,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
