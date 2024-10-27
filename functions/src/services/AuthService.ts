import { IUserRepository } from '../interfaces/IUserRepository';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { inject } from 'tsyringe';

export class AuthService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });
    return token;
  }
}
