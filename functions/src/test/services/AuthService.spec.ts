import 'reflect-metadata';
import { AuthService } from '../../services/AuthService';
import { IUserRepository } from '../../interfaces/IUserRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    authService = new AuthService(userRepository);
    process.env.JWT_SECRET = 'test_secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email, password: hashedPassword };

      userRepository.getUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake_token');

      const token = await authService.login(email, password);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(token).toBe('fake_token');
    });

    it('should throw an error for invalid email', async () => {
      const email = 'invalid@example.com';
      const password = 'password';

      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrong_password';
      const user = { email, password: 'hashed_password' };

      userRepository.getUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error if JWT secret is not configured', async () => {
      delete process.env.JWT_SECRET;

      const email = 'test@example.com';
      const password = 'password';
      const user = { email, password: 'hashed_password' };

      userRepository.getUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(email, password)).rejects.toThrow(
        'JWT secret not configured'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
