import express from 'express';
import {
  createWeeklyCheckIn,
  updateWeeklyCheckIn,
  getWeeklyCheckIns,
  getCurrentWeekCheckIn,
  getWeeklyStats,
} from '../controllers/weeklyCheckInController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createWeeklyCheckIn);
router.put('/:id', updateWeeklyCheckIn);
router.get('/', getWeeklyCheckIns);
router.get('/current', getCurrentWeekCheckIn);
router.get('/stats', getWeeklyStats);

export default router;
