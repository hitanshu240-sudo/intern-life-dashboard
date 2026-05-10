"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, LogOut, TrendingUp } from "lucide-react";
import { weeklyCheckInAPI } from "@/lib/api";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ProgressPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(12);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchStats();
  }, [router, timeRange]);

  const fetchStats = async () => {
    try {
      const response = await weeklyCheckInAPI.getStats(timeRange);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const chartData =
    stats?.trends.map((trend: any) => ({
      week: format(new Date(trend.week), "MMM dd"),
      Learning: trend.learningScore,
      Productivity: trend.productivityScore,
      Discipline: trend.disciplineScore,
      Overall: trend.overallScore,
    })) || [];

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
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
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
                  className="text-indigo-600 font-medium"
                >
                  Progress
                </Link>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Progress</h2>
            <p className="text-gray-600 mt-1">Track your growth over time</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange(4)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 4
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              4 Weeks
            </button>
            <button
              onClick={() => setTimeRange(12)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 12
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              12 Weeks
            </button>
            <button
              onClick={() => setTimeRange(24)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 24
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              24 Weeks
            </button>
          </div>
        </div>

        {stats && stats.totalCheckIns > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Check-ins</span>
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCheckIns}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900">Avg Learning</span>
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.averageScores.learning}/10
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-900">Avg Productivity</span>
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {stats.averageScores.productivity}/10
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-900">Avg Discipline</span>
                  <span className="text-2xl">💪</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.averageScores.discipline}/10
                </p>
              </div>
            </div>

            {/* Overall Score Trend */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Overall Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Overall"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Individual Score Trends */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Score Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Learning"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="Productivity"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="Discipline"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Multi-line Comparison */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                All Metrics Comparison
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis domain={[0, 10]} stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Learning"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Productivity"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Discipline"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Overall"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Insights
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Overall Average:</strong>{" "}
                  {stats.averageScores.overall}/10 -
                  {stats.averageScores.overall >= 8
                    ? " Excellent performance! Keep it up! 🎉"
                    : stats.averageScores.overall >= 6
                      ? " Good progress! Room for improvement. 💪"
                      : " There's potential for growth. Stay consistent! 🚀"}
                </p>
                <p className="text-gray-700">
                  <strong>Best Area:</strong>{" "}
                  {stats.averageScores.learning >=
                    stats.averageScores.productivity &&
                  stats.averageScores.learning >= stats.averageScores.discipline
                    ? "Learning 📚"
                    : stats.averageScores.productivity >=
                        stats.averageScores.discipline
                      ? "Productivity ⚡"
                      : "Discipline 💪"}
                </p>
                <p className="text-gray-700">
                  <strong>Focus Area:</strong>{" "}
                  {stats.averageScores.learning <=
                    stats.averageScores.productivity &&
                  stats.averageScores.learning <= stats.averageScores.discipline
                    ? "Learning - Invest more time in skill development 📚"
                    : stats.averageScores.productivity <=
                        stats.averageScores.discipline
                      ? "Productivity - Work on efficiency and output ⚡"
                      : "Discipline - Build stronger habits 💪"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating weekly check-ins to see your progress here!
            </p>
            <Link
              href="/dashboard/checkins"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Create Your First Check-in
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
