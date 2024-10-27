import { Request, Response } from 'express';
import { IUserService } from '../interfaces/IUserService';
import { inject } from 'tsyringe';

export class UserController {
  constructor(@inject('UserService') private userService: IUserService) {}

  async getUser(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.registerUser(email, password);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const data = req.body;
      await this.userService.updateUser(email, data);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}
