import 'reflect-metadata';
import { UserService } from '../../services/UserService';
import { IUserRepository } from '../../interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';

jest.mock('bcrypt'); // Mock completo de bcrypt

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Crear un mock para `UserRepository`
    userRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    userService = new UserService(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return a user without the password if found', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail('test@example.com');

      expect(result).toEqual({ email: 'test@example.com' });
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should return null if the user is not found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      const result = await userService.findUserByEmail(
        'nonexistent@example.com'
      );

      expect(result).toBeNull();
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com'
      );
    });
  });

  describe('registerUser', () => {
    it('should throw an error if the user already exists', async () => {
      const existingUser: User = {
        email: 'existing@example.com',
        password: 'hashedPassword',
      };
      userRepository.getUserByEmail.mockResolvedValue(existingUser);

      await expect(
        userService.registerUser('existing@example.com', 'password123')
      ).rejects.toThrow('User already exists');
    });

    it('should create a new user with a hashed password', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock de bcrypt.hash

      const result = await userService.registerUser(
        'newuser@example.com',
        'password123'
      );

      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'hashedPassword',
      });
      expect(result).toEqual({ email: 'newuser@example.com' });
    });
  });

  describe('updateUser', () => {
    it('should hash the password before updating if a password is provided', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword'); // Mock de bcrypt.hash

      const userData: Partial<User> = { password: 'newpassword123' };
      await userService.updateUser('test@example.com', userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        'test@example.com',
        {
          password: 'newHashedPassword',
        }
      );
    });

    it('should update the user without hashing if no password is provided', async () => {
      const userData: Partial<User> = { email: 'updated@example.com' };
      await userService.updateUser('test@example.com', userData);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        'test@example.com',
        userData
      );
    });
  });
});
