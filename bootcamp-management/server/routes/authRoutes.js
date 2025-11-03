import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Admin registration of users (trainer, coordinator, student)
router.post(
  '/register',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['trainer', 'coordinator', 'student']).withMessage('Invalid role'),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Logout
router.post('/logout', logout);

// Get current user profile
router.get('/me', authenticateToken, getProfile);

export default router;