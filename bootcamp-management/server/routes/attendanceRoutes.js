import { Router } from 'express';
import { body } from 'express-validator';
import { generateSession, markAttendance } from '../controllers/attendanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Generate attendance session (trainer or coordinator)
router.post(
  '/session',
  authenticateToken,
  authorizeRoles('trainer', 'coordinator'),
  [
    body('bootcampId').isMongoId().withMessage('bootcampId is required'),
    body('batchId').isMongoId().withMessage('batchId is required'),
  ],
  generateSession
);

// Mark attendance (student)
router.post(
  '/mark',
  authenticateToken,
  authorizeRoles('student'),
  [body('code').notEmpty().withMessage('Attendance code is required')],
  markAttendance
);

export default router;