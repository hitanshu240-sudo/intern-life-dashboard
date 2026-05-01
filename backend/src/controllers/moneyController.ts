import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import MoneyTransaction from '../models/MoneyTransaction';

export const createTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { type, amount, category, description, date } = req.body;

    const transaction = new MoneyTransaction({
      userId,
      type,
      amount,
      category,
      description,
      date: date || new Date(),
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, type, limit = 50 } = req.query;

    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    if (type) {
      query.type = type;
    }

    const transactions = await MoneyTransaction.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const transaction = await MoneyTransaction.findOne({ _id: id, userId });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    if (type !== undefined) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (category !== undefined) transaction.category = category;
    if (description !== undefined) transaction.description = description;
    if (date !== undefined) transaction.date = date;

    await transaction.save();

    res.json({
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const transaction = await MoneyTransaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlyStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month ? Number(month) : currentDate.getMonth() + 1;
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const transactions = await MoneyTransaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categoryBreakdown: {} as Record<string, number>,
      transactionCount: transactions.length,
    };

    transactions.forEach((t) => {
      if (t.type === 'income') {
        stats.totalIncome += t.amount;
      } else {
        stats.totalExpenses += t.amount;
        stats.categoryBreakdown[t.category] = (stats.categoryBreakdown[t.category] || 0) + t.amount;
      }
    });

    stats.balance = stats.totalIncome - stats.totalExpenses;

    res.json({ stats });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getYearlyOverview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { year } = req.query;

    const targetYear = year ? Number(year) : new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);

    const transactions = await MoneyTransaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const monthlyData = Array(12).fill(null).map(() => ({
      income: 0,
      expenses: 0,
      balance: 0,
    }));

    transactions.forEach((t) => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
      monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expenses;
    });

    res.json({ yearlyOverview: monthlyData });
  } catch (error) {
    console.error('Get yearly overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
