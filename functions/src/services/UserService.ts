import 'reflect-metadata';
import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../models/User';
import { inject, injectable } from 'tsyringe';
import bcrypt from 'bcrypt';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async findUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async registerUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      email,
      password: hashedPassword,
    };

    await this.userRepository.createUser(newUser);
    const { password: passwordUser, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(email: string, data: Partial<User>): Promise<void> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.updateUser(email, data);
  }
}
