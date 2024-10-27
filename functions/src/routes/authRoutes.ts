import 'reflect-metadata';
import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();
const userRepository = container.resolve<UserRepository>('UserRepository');
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/login', loginLimiter, (req, res) =>
  authController.login(req, res)
);

export default router;
