import { Router } from 'express';
import { body, param } from 'express-validator';
import { createBatch, addStudents, getBatch } from '../controllers/batchController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new batch (admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  [
    body('bootcampId').isMongoId().withMessage('bootcampId is required'),
    body('name').notEmpty().withMessage('Batch name is required'),
    body('coordinatorId').isMongoId().withMessage('Coordinator ID is required'),
    body('trainerId').isMongoId().withMessage('Trainer ID is required'),
  ],
  createBatch
);

// Add students to batch (admin)
router.post(
  '/:batchId/students',
  authenticateToken,
  authorizeRoles('admin'),
  [param('batchId').isMongoId().withMessage('Invalid batch ID')],
  addStudents
);

// Get batch details
router.get(
  '/:id',
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid ID')],
  getBatch
);

export default router;