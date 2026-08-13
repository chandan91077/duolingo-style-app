"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, Zap, Flame } from "lucide-react";
import { LessonCompleteResponse } from "@/lib/types";

interface LessonCelebrationProps {
  summary: LessonCompleteResponse;
}

export const LessonCelebration: React.FC<LessonCelebrationProps> = ({
  summary,
}) => {
  useEffect(() => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center animate-pop">
      {/* Trophy */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 border-4 shadow-lg text-amber-500 animate-bounce-subtle"
        style={{
          backgroundColor: "var(--card-elevated)",
          borderColor: "var(--border)",
        }}
      >
        <Trophy size={56} />
      </div>

      <h1 className="text-3xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
        Lesson Complete!
      </h1>
      <p className="text-sm font-bold mb-8" style={{ color: "var(--muted-foreground)" }}>
        You completed the lesson with great success!
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* XP Earned */}
        <div className="card-duo p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
            <Zap size={22} className="fill-current" />
            <span className="font-extrabold text-xs uppercase">TOTAL XP</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-500">
            +{summary.xp_earned} XP
          </span>
        </div>

        {/* Streak */}
        <div className="card-duo p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-orange-500 mb-1">
            <Flame size={22} className="fill-current" />
            <span className="font-extrabold text-xs uppercase">STREAK</span>
          </div>
          <span className="text-2xl font-extrabold text-orange-500">
            {summary.streak} DAYS
          </span>
        </div>
      </div>

      {/* Skill Unlocked */}
      {summary.skill_completed && (
        <div
          className="rounded-2xl p-4 mb-8 font-extrabold text-sm flex items-center justify-center gap-2 border-2"
          style={{
            backgroundColor: "var(--correct-bg)",
            borderColor: "var(--correct-border)",
            color: "var(--correct-text)",
          }}
        >
          <span>🎉 SKILL COMPLETED &amp; NEXT SKILL UNLOCKED!</span>
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
