import { Router } from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/documentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload document to a bootcamp folder (trainer or coordinator)
router.post(
  '/:bootcampId',
  authenticateToken,
  authorizeRoles('trainer', 'coordinator'),
  upload.single('file'),
  uploadDocument
);

export default router;