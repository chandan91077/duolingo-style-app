"use client";

import React, { useEffect, useState } from "react";
import { LeaderboardEntry, Learner } from "@/lib/types";
import { getLeaderboard, getLearner, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Trophy, Zap, Flame } from "lucide-react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [lbData, learnerData] = await Promise.all([
        getLeaderboard(),
        getLearner(),
      ]);
      setLeaderboard(lbData);
      setLearner(learnerData);
    } catch (err: any) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefillHearts = async () => {
    try {
      const updated = await refillHearts();
      setLearner(updated);
    } catch (err) {
      alert("Failed to refill hearts");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-gray-600 text-sm">Loading leaderboard rankings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopBar learner={learner} onRefillClick={handleRefillHearts} />

      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Header Banner */}
        <div className="card-duo p-6 text-center bg-gradient-to-b from-amber-50 to-white border-amber-200 mb-8">
          <div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-500">
            <Trophy size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Global Leaderboard</h1>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Top learners competing this week! Complete lessons to gain XP.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="card-duo divide-y divide-gray-100 overflow-hidden">
          {leaderboard.map((entry) => {
            const getRankBadge = (rank: number) => {
              if (rank === 1) return <span className="text-xl">🥇</span>;
              if (rank === 2) return <span className="text-xl">🥈</span>;
              if (rank === 3) return <span className="text-xl">🥉</span>;
              return (
                <span className="font-extrabold text-sm text-gray-500 w-6 text-center">
                  {rank}
                </span>
              );
            };

            return (
              <div
                key={entry.id}
                className={`p-4 flex items-center justify-between transition ${
                  entry.is_current_user
                    ? "bg-sky-50 font-extrabold border-l-4 border-l-sky-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(entry.rank)}
                  </div>

                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl border border-gray-200">
                    {entry.avatar || "👤"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-800">
                        {entry.name}
                      </span>
                      {entry.is_current_user && (
                        <span className="bg-sky-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-orange-500">
                      <Flame size={12} className="fill-current" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <Zap size={16} className="fill-current" />
                  <span>{entry.total_xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
