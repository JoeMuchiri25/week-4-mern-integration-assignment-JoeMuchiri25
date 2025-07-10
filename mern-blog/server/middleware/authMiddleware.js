import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'yourSecretKey'; // Ideally from process.env.JWT_SECRET

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

export default protect;
