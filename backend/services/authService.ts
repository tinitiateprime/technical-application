import jwt from 'jsonwebtoken';

export const createJWT = (user: { name: string; email: string }) => {
  const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '30d' });
  return token;
};
