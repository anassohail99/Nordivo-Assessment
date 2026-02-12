import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      const user = new User({ email, password, name });
      await user.save();

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          rewardPoints: user.rewardPoints
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          rewardPoints: user.rewardPoints
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        rewardPoints: user.rewardPoints
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();
