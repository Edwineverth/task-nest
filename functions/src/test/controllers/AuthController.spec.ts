import 'reflect-metadata';
import { Request, Response } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { AuthService } from '../../services/AuthService';
import { IUserRepository } from '../../interfaces/IUserRepository';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Mock del UserRepository, ya que es necesario para crear AuthService
    const userRepository: jest.Mocked<IUserRepository> = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    };

    // Crear instancia de AuthService con el repositorio mockeado
    authService = new AuthService(userRepository) as jest.Mocked<AuthService>;

    // Mockear el método login de AuthService
    authService.login = jest.fn();

    authController = new AuthController(authService);

    // Mock de Request y Response
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      // Configuramos el mock de Request con un email y password válidos
      req.body = { email: 'test@example.com', password: 'password' };

      // Mockeamos el método login del AuthService para devolver un token simulado
      authService.login.mockResolvedValue('fake_token');

      await authController.login(req as Request, res as Response);

      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'fake_token' });
    });

    it('should return 401 for invalid credentials', async () => {
      // Configuramos el mock de Request con un email y password no válidos
      req.body = { email: 'test@example.com', password: 'wrong_password' };

      // Mockeamos el método login del AuthService para lanzar un error
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      await authController.login(req as Request, res as Response);

      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'wrong_password'
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 500 for an unexpected error', async () => {
      // Configuramos el mock de Request con cualquier dato
      req.body = { email: 'test@example.com', password: 'password' };

      // Mockeamos el método login del AuthService para lanzar un error inesperado
      authService.login.mockRejectedValue('Unexpected error');

      await authController.login(req as Request, res as Response);

      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password'
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An unexpected error occurred',
      });
    });
  });
});
