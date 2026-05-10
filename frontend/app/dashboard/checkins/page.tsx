"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, LogOut, Plus, Calendar, TrendingUp } from "lucide-react";
import { weeklyCheckInAPI } from "@/lib/api";
import { format } from "date-fns";

export default function CheckInsPage() {
  const router = useRouter();
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [currentCheckIn, setCurrentCheckIn] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    learnings: [""],
    tasks: [""],
    wins: [""],
    struggles: [""],
    learningScore: 5,
    productivityScore: 5,
    disciplineScore: 5,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCheckIns();
  }, [router]);

  const fetchCheckIns = async () => {
    try {
      const [currentRes, allRes] = await Promise.all([
        weeklyCheckInAPI.getCurrent(),
        weeklyCheckInAPI.getAll(10),
      ]);
      setCurrentCheckIn(currentRes.data.checkIn);
      setCheckIns(allRes.data.checkIns);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field: string, index: number, value: string) => {
    const updatedArray = [
      ...(formData[field as keyof typeof formData] as string[]),
    ];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayField = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as string[]), ""],
    });
  };

  const removeArrayField = (field: string, index: number) => {
    const updatedArray = (
      formData[field as keyof typeof formData] as string[]
    ).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = {
        learnings: formData.learnings.filter((l) => l.trim()),
        tasks: formData.tasks.filter((t) => t.trim()),
        wins: formData.wins.filter((w) => w.trim()),
        struggles: formData.struggles.filter((s) => s.trim()),
        learningScore: formData.learningScore,
        productivityScore: formData.productivityScore,
        disciplineScore: formData.disciplineScore,
      };

      if (currentCheckIn) {
        await weeklyCheckInAPI.update(currentCheckIn._id, cleanedData);
      } else {
        await weeklyCheckInAPI.create(cleanedData);
      }

      await fetchCheckIns();
      setShowForm(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save check-in");
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
                  className="text-indigo-600 font-medium"
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
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Weekly Check-ins</h2>
          {!currentCheckIn && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5" />
              <span>New Check-in</span>
            </button>
          )}
        </div>

        {/* Check-in Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Create Weekly Check-in
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Learnings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you learn this week?
                </label>
                {formData.learnings.map((learning, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={learning}
                      onChange={(e) =>
                        handleArrayInput("learnings", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="E.g., Learned React hooks"
                    />
                    {formData.learnings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("learnings", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("learnings")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  + Add more
                </button>
              </div>

              {/* Tasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasks completed
                </label>
                {formData.tasks.map((task, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={task}
                      onChange={(e) =>
                        handleArrayInput("tasks", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="E.g., Built new feature"
                    />
                    {formData.tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("tasks", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("tasks")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  + Add more
                </button>
              </div>

              {/* Wins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wins & achievements
                </label>
                {formData.wins.map((win, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={win}
                      onChange={(e) =>
                        handleArrayInput("wins", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="E.g., Got praise from manager"
                    />
                    {formData.wins.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("wins", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("wins")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  + Add more
                </button>
              </div>

              {/* Struggles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Struggles & challenges
                </label>
                {formData.struggles.map((struggle, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={struggle}
                      onChange={(e) =>
                        handleArrayInput("struggles", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="E.g., Struggled with debugging"
                    />
                    {formData.struggles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("struggles", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("struggles")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  + Add more
                </button>
              </div>

              {/* Scores */}
              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.learningScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        learningScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productivity Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.productivityScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productivityScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discipline Score (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.disciplineScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        disciplineScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Save Check-in
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Current Week Check-in */}
        {currentCheckIn && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mb-8 border border-indigo-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  This Week's Check-in
                </h3>
                <p className="text-gray-600">
                  Week of{" "}
                  {format(
                    new Date(currentCheckIn.weekStartDate),
                    "MMM dd, yyyy",
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-lg">
                  {currentCheckIn.overallScore}/10
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  📚 Learnings
                </h4>
                <ul className="space-y-1">
                  {currentCheckIn.learnings.map((l: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      • {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">✅ Tasks</h4>
                <ul className="space-y-1">
                  {currentCheckIn.tasks.map((t: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🎉 Wins</h4>
                <ul className="space-y-1">
                  {currentCheckIn.wins.map((w: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      • {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  😓 Struggles
                </h4>
                <ul className="space-y-1">
                  {currentCheckIn.struggles.map((s: string, i: number) => (
                    <li key={i} className="text-gray-700">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-indigo-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {currentCheckIn.learningScore}/10
                </div>
                <div className="text-sm text-gray-600">Learning</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {currentCheckIn.productivityScore}/10
                </div>
                <div className="text-sm text-gray-600">Productivity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {currentCheckIn.disciplineScore}/10
                </div>
                <div className="text-sm text-gray-600">Discipline</div>
              </div>
            </div>
          </div>
        )}

        {/* Past Check-ins */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Past Check-ins
          </h3>
          <div className="space-y-4">
            {checkIns.length === 0 && !currentCheckIn && (
              <div className="text-center py-12 text-gray-500">
                No check-ins yet. Create your first one!
              </div>
            )}
            {checkIns.map((checkIn) => (
              <div
                key={checkIn._id}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Week of{" "}
                        {format(
                          new Date(checkIn.weekStartDate),
                          "MMM dd, yyyy",
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(checkIn.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {checkIn.overallScore}/10
                    </div>
                    <div className="text-xs text-gray-500">Overall Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">
                      {checkIn.learningScore}/10
                    </div>
                    <div className="text-gray-600">Learning</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-600">
                      {checkIn.productivityScore}/10
                    </div>
                    <div className="text-gray-600">Productivity</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-600">
                      {checkIn.disciplineScore}/10
                    </div>
                    <div className="text-gray-600">Discipline</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
