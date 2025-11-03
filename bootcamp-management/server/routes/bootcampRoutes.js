import { Router } from 'express';
import { body, param } from 'express-validator';
import { createBootcamp, listBootcamps, getBootcamp } from '../controllers/bootcampController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new bootcamp (admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
    body('endDate').isISO8601().toDate().withMessage('Valid end date is required'),
  ],
  createBootcamp
);

// List bootcamps
router.get('/', authenticateToken, listBootcamps);

// Get bootcamp by ID
router.get(
  '/:id',
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid ID')],
  getBootcamp
);

export default router;