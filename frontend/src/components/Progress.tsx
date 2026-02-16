import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { FlashCard } from "../App";

interface ProgressProps {
  cards: FlashCard[];
}

export function Progress({ cards }: ProgressProps) {
  // Knowledge distribution
  const knowledgeDistribution = {
    dontKnow: cards.filter((c) => c.knowledgeLevel === 0).length,
    almost: cards.filter((c) => c.knowledgeLevel === 1).length,
    know: cards.filter((c) => c.knowledgeLevel === 2).length,
  };

  const pieData = [
    {
      name: "Don`t know",
      value: knowledgeDistribution.dontKnow,
      color: "#9CA3AF",
    },
    { name: "Almost", value: knowledgeDistribution.almost, color: "#FCD34D" },
    { name: "Know", value: knowledgeDistribution.know, color: "#34D399" },
  ];

  // Activity by date (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const activityData = last7Days.map((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const reviewed = cards.filter((card) => {
      if (!card.lastReviewed) return false;
      const reviewDateStr = new Date(card.lastReviewed)
        .toISOString()
        .split("T")[0];
      return reviewDateStr === dateStr;
    }).length;

    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      reviewed,
    };
  });

  const totalCards = cards.length;
  const totalReviews = cards.reduce((sum, card) => sum + card.repetitions, 0);
  const averageKnowledge =
    totalCards > 0
      ? (
          cards.reduce((sum, card) => sum + card.knowledgeLevel, 0) / totalCards
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-medium mb-6">Learning progress</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total cards</div>
          <div className="text-3xl font-medium text-gray-900">{totalCards}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Total reviews</div>
          <div className="text-3xl font-medium text-blue-600">
            {totalReviews}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Intermediate level</div>
          <div className="text-3xl font-medium text-green-600">
            {averageKnowledge}
          </div>
        </div>
      </div>

      {/* Knowledge distribution pie chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="font-medium mb-4">Knowledge distribution</h3>
        {totalCards > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data to display
          </div>
        )}
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="font-medium mb-4">Activity for the last 7 days</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reviewed" fill="#3B82F6" name="Cards reviewed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h3 className="font-medium mb-4">Detailed statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-600">❌ Don´t know</span>
            <span className="font-medium">
              {knowledgeDistribution.dontKnow} cards
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-600">⚠️ Almost</span>
            <span className="font-medium">
              {knowledgeDistribution.almost} cards
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-600">✅ Know</span>
            <span className="font-medium">
              {knowledgeDistribution.know} cards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
