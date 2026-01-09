import { Request, Response } from 'express';
import { createJWT } from '../services/authService';

export const loginUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  // Generate JWT token
  const token = createJWT({ name, email });

  // Respond with the token
  res.status(200).json({ message: 'Logged in successfully', token });
};
