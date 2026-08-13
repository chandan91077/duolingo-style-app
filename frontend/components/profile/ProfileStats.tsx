"use client";

import React from "react";
import { Zap, Flame, CheckCircle, Award, Target } from "lucide-react";
import { Learner } from "@/lib/types";

interface ProfileStatsProps {
  learner: Learner;
  completedSkills: number;
  completedLessons: number;
  todayXp: number;
  dailyGoalPercentage: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  learner,
  completedSkills,
  completedLessons,
  todayXp,
  dailyGoalPercentage,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Learner Profile Header */}
      <div className="card-duo p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-gradient-to-r from-sky-50 to-white">
        <div className="w-24 h-24 bg-sky-200 border-4 border-sky-300 rounded-full flex items-center justify-center text-4xl shadow-md">
          {learner.avatar || "🚀"}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">{learner.name}</h1>
          <p className="text-sm font-semibold text-gray-500">{learner.email}</p>
          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="bg-sky-100 text-sky-700 text-xs font-extrabold px-3 py-1 rounded-xl border border-sky-200">
              SPANISH LEARNER
            </span>
          </div>
        </div>
      </div>

      {/* Daily XP Goal Card */}
      <div className="card-duo p-5 mb-6 bg-amber-50/50 border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
            <Target size={20} />
            <span>DAILY XP GOAL</span>
          </div>
          <span className="text-xs font-extrabold text-amber-700">
            {todayXp} / {learner.dailyXpGoal} XP
          </span>
        </div>

        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, dailyGoalPercentage)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total XP */}
        <div className="card-duo p-4 text-center bg-amber-50/40">
          <Zap size={24} className="text-amber-500 mx-auto mb-1 fill-current" />
          <span className="block text-xl font-extrabold text-gray-800">{learner.totalXp}</span>
          <span className="text-[11px] font-extrabold text-gray-400 uppercase">TOTAL XP</span>
        </div>

        {/* Streak */}
        <div className="card-duo p-4 text-center bg-orange-50/40">
          <Flame size={24} className="text-orange-500 mx-auto mb-1 fill-current" />
          <span className="block text-xl font-extrabold text-gray-800">{learner.streak}</span>
          <span className="text-[11px] font-extrabold text-gray-400 uppercase">STREAK DAYS</span>
        </div>

        {/* Completed Lessons */}
        <div className="card-duo p-4 text-center bg-sky-50/40">
          <CheckCircle size={24} className="text-sky-500 mx-auto mb-1" />
          <span className="block text-xl font-extrabold text-gray-800">{completedLessons}</span>
          <span className="text-[11px] font-extrabold text-gray-400 uppercase">LESSONS</span>
        </div>

        {/* Completed Skills */}
        <div className="card-duo p-4 text-center bg-green-50/40">
          <Award size={24} className="text-green-500 mx-auto mb-1" />
          <span className="block text-xl font-extrabold text-gray-800">{completedSkills}</span>
          <span className="text-[11px] font-extrabold text-gray-400 uppercase">SKILLS</span>
        </div>
      </div>
    </div>
  );
};
