import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllNotifications,
  getPriorityNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/',protect,getAllNotifications);
router.get('/priority',protect,getPriorityNotifications);

export default router;