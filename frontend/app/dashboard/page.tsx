"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, TrendingUp, Wallet, Target, LogOut, Plus } from "lucide-react";
import { weeklyCheckInAPI, moneyAPI } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  currentStreak: number;
  longestStreak: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentCheckIn, setCurrentCheckIn] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [checkInRes, moneyRes] = await Promise.all([
        weeklyCheckInAPI.getCurrent(),
        moneyAPI.getMonthlyStats(),
      ]);

      setCurrentCheckIn(checkInRes.data.checkIn);
      setMonthlyStats(moneyRes.data.stats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Intern Life</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-indigo-600 font-medium">
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/checkins"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Check-ins
                </Link>
                <Link
                  href="/dashboard/money"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Money
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Progress
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600">Here's your weekly overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">{user.currentStreak}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Current Streak</h3>
            <p className="text-orange-100">
              Longest: {user.longestStreak} weeks
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">
                {currentCheckIn ? "✓" : "—"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              This Week
            </h3>
            <p className="text-gray-600">
              {currentCheckIn ? "Checked in" : "Not checked in"}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {monthlyStats ? `₹${monthlyStats.balance}` : "₹0"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Balance
            </h3>
            <p className="text-gray-600">This month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">
                {currentCheckIn ? currentCheckIn.overallScore : "—"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Overall Score
            </h3>
            <p className="text-gray-600">This week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Weekly Check-in
            </h3>
            {currentCheckIn ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Learning Score</span>
                  <span className="font-semibold text-gray-900">
                    {currentCheckIn.learningScore}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Productivity Score</span>
                  <span className="font-semibold text-gray-900">
                    {currentCheckIn.productivityScore}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discipline Score</span>
                  <span className="font-semibold text-gray-900">
                    {currentCheckIn.disciplineScore}/10
                  </span>
                </div>
                <Link
                  href="/dashboard/checkins"
                  className="block text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 mt-4"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  You haven't checked in this week yet
                </p>
                <Link
                  href="/dashboard/checkins"
                  className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Check-in</span>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Money This Month
            </h3>
            {monthlyStats && monthlyStats.transactionCount > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Income</span>
                  <span className="font-semibold text-green-600">
                    ₹{monthlyStats.totalIncome}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expenses</span>
                  <span className="font-semibold text-red-600">
                    ₹{monthlyStats.totalExpenses}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-900 font-medium">Balance</span>
                  <span
                    className={`font-bold ${monthlyStats.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ₹{monthlyStats.balance}
                  </span>
                </div>
                <Link
                  href="/dashboard/money"
                  className="block text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 mt-4"
                >
                  View All Transactions
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No transactions this month</p>
                <Link
                  href="/dashboard/money"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Transaction</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Keep the momentum going! 🚀
          </h3>
          <p className="text-indigo-100 mb-6">
            Check your progress and see how you're improving week over week
          </p>
          <Link
            href="/dashboard/progress"
            className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold"
          >
            View Progress
          </Link>
        </div>
      </main>
    </div>
  );
}
