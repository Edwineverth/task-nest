import { User } from '../models/User';

export interface IUserService {
  findUserByEmail(email: string): Promise<Omit<User, 'password'> | null>;
  registerUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>>;
  updateUser(email: string, data: Partial<User>): Promise<void>;
}
