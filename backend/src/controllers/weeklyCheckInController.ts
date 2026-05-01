import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import WeeklyCheckIn from '../models/WeeklyCheckIn';
import User from '../models/User';

// Helper function to get week boundaries
const getWeekBoundaries = (date: Date) => {
  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
};

// Helper function to update streak
const updateUserStreak = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  const lastCheckIn = user.lastCheckInDate;

  if (!lastCheckIn) {
    // First check-in
    user.currentStreak = 1;
    user.longestStreak = 1;
  } else {
    const daysSinceLastCheckIn = Math.floor(
      (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastCheckIn === 7) {
      // Consecutive week
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else if (daysSinceLastCheckIn > 7) {
      // Streak broken
      user.currentStreak = 1;
    }
    // If less than 7 days, don't update (same week)
  }

  user.lastCheckInDate = today;
  await user.save();
};

export const createWeeklyCheckIn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { learnings, tasks, wins, struggles, learningScore, productivityScore, disciplineScore } = req.body;

    const { weekStart, weekEnd } = getWeekBoundaries(new Date());

    // Check if check-in already exists for this week
    const existingCheckIn = await WeeklyCheckIn.findOne({
      userId,
      weekStartDate: weekStart,
    });

    if (existingCheckIn) {
      res.status(400).json({ message: 'Check-in already exists for this week' });
      return;
    }

    const checkIn = new WeeklyCheckIn({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      learnings,
      tasks,
      wins,
      struggles,
      learningScore,
      productivityScore,
      disciplineScore,
    });

    await checkIn.save();
    await updateUserStreak(userId);

    res.status(201).json({
      message: 'Weekly check-in created successfully',
      checkIn,
    });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateWeeklyCheckIn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { learnings, tasks, wins, struggles, learningScore, productivityScore, disciplineScore } = req.body;

    const checkIn = await WeeklyCheckIn.findOne({ _id: id, userId });

    if (!checkIn) {
      res.status(404).json({ message: 'Check-in not found' });
      return;
    }

    // Update fields
    if (learnings !== undefined) checkIn.learnings = learnings;
    if (tasks !== undefined) checkIn.tasks = tasks;
    if (wins !== undefined) checkIn.wins = wins;
    if (struggles !== undefined) checkIn.struggles = struggles;
    if (learningScore !== undefined) checkIn.learningScore = learningScore;
    if (productivityScore !== undefined) checkIn.productivityScore = productivityScore;
    if (disciplineScore !== undefined) checkIn.disciplineScore = disciplineScore;

    await checkIn.save();

    res.json({
      message: 'Weekly check-in updated successfully',
      checkIn,
    });
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeeklyCheckIns = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { limit = 10 } = req.query;

    const checkIns = await WeeklyCheckIn.find({ userId })
      .sort({ weekStartDate: -1 })
      .limit(Number(limit));

    res.json({ checkIns });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentWeekCheckIn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { weekStart } = getWeekBoundaries(new Date());

    const checkIn = await WeeklyCheckIn.findOne({
      userId,
      weekStartDate: weekStart,
    });

    res.json({ checkIn });
  } catch (error) {
    console.error('Get current week check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeeklyStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { weeks = 12 } = req.query;

    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - Number(weeks) * 7);

    const checkIns = await WeeklyCheckIn.find({
      userId,
      weekStartDate: { $gte: weeksAgo },
    }).sort({ weekStartDate: 1 });

    const stats = {
      totalCheckIns: checkIns.length,
      averageScores: {
        learning: 0,
        productivity: 0,
        discipline: 0,
        overall: 0,
      },
      trends: checkIns.map((c) => ({
        week: c.weekStartDate,
        learningScore: c.learningScore,
        productivityScore: c.productivityScore,
        disciplineScore: c.disciplineScore,
        overallScore: c.overallScore,
      })),
    };

    if (checkIns.length > 0) {
      const totals = checkIns.reduce(
        (acc, c) => ({
          learning: acc.learning + c.learningScore,
          productivity: acc.productivity + c.productivityScore,
          discipline: acc.discipline + c.disciplineScore,
          overall: acc.overall + c.overallScore,
        }),
        { learning: 0, productivity: 0, discipline: 0, overall: 0 }
      );

      stats.averageScores = {
        learning: Number((totals.learning / checkIns.length).toFixed(1)),
        productivity: Number((totals.productivity / checkIns.length).toFixed(1)),
        discipline: Number((totals.discipline / checkIns.length).toFixed(1)),
        overall: Number((totals.overall / checkIns.length).toFixed(1)),
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
