"use client";

import React from "react";
import { Learner } from "@/lib/types";

interface TopBarProps {
  learner: Learner | null;
  onRefillClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ learner, onRefillClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-200 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Language Badge */}
        <div className="flex items-center gap-2 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition cursor-pointer">
          <span className="text-xl">🇮🇳</span>
          <span className="hidden sm:inline text-sm tracking-wide">HINDI</span>
        </div>

        {/* Gamification Stats */}
        <div className="flex items-center gap-4 sm:gap-6 font-bold text-sm">
          {/* Streak */}
          <div
            className="flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200"
            title="Daily Streak"
          >
            <span className="text-lg">🔥</span>
            <span>{learner ? learner.streak : 0}</span>
          </div>

          {/* XP */}
          <div
            className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200"
            title="Total XP"
          >
            <span className="text-lg">⚡</span>
            <span>{learner ? learner.totalXp : 0} XP</span>
          </div>

          {/* Hearts */}
          <button
            onClick={onRefillClick}
            className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 hover:bg-red-100 transition cursor-pointer"
            title="Hearts (Click to Refill)"
          >
            <span className="text-lg">❤️</span>
            <span>{learner ? learner.hearts : 0}</span>
          </button>

          {/* Gems */}
          <div
            className="flex items-center gap-1.5 text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 hidden xs:flex"
            title="Gems"
          >
            <span className="text-lg">💎</span>
            <span>{learner ? learner.gems : 0}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
