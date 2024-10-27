import 'reflect-metadata';
import { container } from 'tsyringe';
import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { IUserService } from '../interfaces/IUserService';
import { authenticatorMiddleware } from '../middleware/authenticator';
import { userSchema } from '../validators/userValidator';
import { validateRequest } from '../middleware/validateRequest';
import { createAccountLimiter } from '../middleware/rateLimiter';

const router = Router();
const userService = container.resolve<IUserService>('UserService');
const userController = new UserController(userService);

router.post(
  '/users',
  createAccountLimiter,
  validateRequest(userSchema),
  (req, res) => userController.createUser(req, res)
);
router.get('/users/:email', authenticatorMiddleware, (req, res) =>
  userController.getUser(req, res)
);
router.put(
  '/users/:email',
  authenticatorMiddleware,
  validateRequest(userSchema),
  (req, res) => userController.updateUser(req, res)
);

export default router;
