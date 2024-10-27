import { User } from '../models/User';

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<void>;
  updateUser(email: string, user: Partial<User>): Promise<void>;
}
