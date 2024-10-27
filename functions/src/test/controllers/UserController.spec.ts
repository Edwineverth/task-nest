import 'reflect-metadata';
import { Request, Response } from 'express';
import { UserController } from '../../controllers/UserController';
import { IUserService } from '../../interfaces/IUserService';
import { User } from '../../models/User';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<IUserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Mock del servicio de usuario
    userService = {
      findUserByEmail: jest.fn(),
      registerUser: jest.fn(),
      updateUser: jest.fn(),
    } as jest.Mocked<IUserService>;

    userController = new UserController(userService);

    // Mock de Request y Response
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const user: Omit<User, 'password'> = { email: 'test@example.com' };
      req.params = { email: 'test@example.com' };
      userService.findUserByEmail.mockResolvedValue(user);

      await userController.getUser(req as Request, res as Response);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user is not found', async () => {
      req.params = { email: 'notfound@example.com' };
      userService.findUserByEmail.mockResolvedValue(null);

      await userController.getUser(req as Request, res as Response);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        'notfound@example.com'
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors and return 500', async () => {
      req.params = { email: 'error@example.com' };
      userService.findUserByEmail.mockRejectedValue(
        new Error('Error fetching user')
      );

      await userController.getUser(req as Request, res as Response);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        'error@example.com'
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching user' });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const newUser = {
        email: 'newuser@example.com',
        password: 'hashedpassword',
      };
      const createdUser = { email: 'newuser@example.com' };
      req.body = newUser;
      userService.registerUser.mockResolvedValue(createdUser);

      await userController.createUser(req as Request, res as Response);

      expect(userService.registerUser).toHaveBeenCalledWith(
        newUser.email,
        newUser.password
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it('should handle errors and return 500', async () => {
      req.body = { email: 'error@example.com', password: 'password' };
      userService.registerUser.mockRejectedValue(
        new Error('Error creating user')
      );

      await userController.createUser(req as Request, res as Response);

      expect(userService.registerUser).toHaveBeenCalledWith(
        req.body.email,
        req.body.password
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user and return a success message', async () => {
      req.params = { email: 'updateuser@example.com' };
      req.body = { password: 'newpassword' };

      await userController.updateUser(req as Request, res as Response);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'updateuser@example.com',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
      });
    });

    it('should handle errors and return 500', async () => {
      req.params = { email: 'erroruser@example.com' };
      req.body = { password: 'newpassword' };
      userService.updateUser.mockRejectedValue(
        new Error('Error updating user')
      );

      await userController.updateUser(req as Request, res as Response);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'erroruser@example.com',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user' });
    });
  });
});
