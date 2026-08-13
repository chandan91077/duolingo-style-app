"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, Zap, Flame, Heart } from "lucide-react";
import { LessonCompleteResponse } from "@/lib/types";

interface LessonCelebrationProps {
  summary: LessonCompleteResponse;
}

export const LessonCelebration: React.FC<LessonCelebrationProps> = ({
  summary,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center animate-pop">
      {/* Trophy Badge */}
      <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-300 shadow-lg text-amber-500 animate-bounce-subtle">
        <Trophy size={56} />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Lesson Complete!</h1>
      <p className="text-sm font-bold text-gray-500 mb-8">
        You completed the lesson with great success!
      </p>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* XP Earned */}
        <div className="card-duo p-4 bg-amber-50 border-amber-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
            <Zap size={22} className="fill-current" />
            <span className="font-extrabold text-xs uppercase">TOTAL XP</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-700">
            +{summary.xp_earned} XP
          </span>
        </div>

        {/* Streak */}
        <div className="card-duo p-4 bg-orange-50 border-orange-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-orange-600 mb-1">
            <Flame size={22} className="fill-current" />
            <span className="font-extrabold text-xs uppercase">STREAK</span>
          </div>
          <span className="text-2xl font-extrabold text-orange-700">
            {summary.streak} DAYS
          </span>
        </div>
      </div>

      {/* Skill Unlocked Alert */}
      {summary.skill_completed && (
        <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4 mb-8 text-green-900 font-extrabold text-sm flex items-center justify-center gap-2">
          <span>🎉 SKILL COMPLETED & NEXT SKILL UNLOCKED!</span>
        </div>
      )}

      <Link
        href="/learn"
        className="btn-duo-green block w-full py-4 rounded-2xl font-extrabold text-base uppercase tracking-wider shadow-lg text-center"
      >
        CONTINUE TO PATH
      </Link>
    </div>
  );
};
