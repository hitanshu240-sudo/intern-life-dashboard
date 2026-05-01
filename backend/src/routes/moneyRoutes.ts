import express from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlyStats,
  getYearlyOverview,
} from '../controllers/moneyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/yearly', getYearlyOverview);

export default router;
