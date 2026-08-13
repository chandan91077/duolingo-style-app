import React from "react";
import { Zap, Flame, CheckCircle, Award, Target } from "lucide-react";
import { Learner } from "@/lib/types";
import { UserAvatar } from "@/components/common/UserAvatar";

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
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">

      {/* Profile Header Card */}
      <div
        className="card-duo p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left"
        style={{ borderRadius: "1rem" }}
      >
        {/* Avatar — smaller on mobile */}
        <div
          className="w-18 h-18 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-4 shadow-md shrink-0 overflow-hidden"
          style={{
            width: "clamp(68px, 15vw, 96px)",
            height: "clamp(68px, 15vw, 96px)",
            backgroundColor: "var(--card-elevated)",
            borderColor: "var(--border)",
          }}
        >
          <UserAvatar avatar={learner.avatar} name={learner.name} sizeClass="w-full h-full" textClass="text-3xl sm:text-4xl" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold truncate"
            style={{ color: "var(--foreground)" }}
          >
            {learner.name}
          </h1>
          <p
            className="text-xs sm:text-sm font-semibold mt-0.5 truncate"
            style={{ color: "var(--muted-foreground)" }}
          >
            {learner.email}
          </p>
          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span
              className="text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-1 rounded-xl border"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--nav-active-text)",
                borderColor: "var(--border)",
              }}
            >
              HINDI LEARNER
            </span>
          </div>
        </div>
      </div>

      {/* Daily XP Goal */}
      <div className="card-duo p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 font-extrabold text-xs sm:text-sm text-amber-500">
            <Target size={18} className="sm:w-5 sm:h-5" />
            <span>DAILY XP GOAL</span>
          </div>
          <span
            className="text-xs font-extrabold"
            style={{ color: "var(--foreground)" }}
          >
            {todayXp} / {learner.dailyXpGoal} XP
          </span>
        </div>
        <div className="progress-track h-3 sm:h-3.5">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, dailyGoalPercentage)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid — 2 cols on mobile, 4 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total XP */}
        <div className="card-duo p-3 sm:p-4 text-center">
          <Zap size={20} className="text-amber-500 mx-auto mb-1 fill-current sm:w-6 sm:h-6" />
          <span
            className="block text-xl sm:text-2xl font-extrabold"
            style={{ color: "var(--foreground)" }}
          >
            {learner.totalXp}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-extrabold uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            TOTAL XP
          </span>
        </div>

        {/* Streak */}
        <div className="card-duo p-3 sm:p-4 text-center">
          <Flame size={20} className="text-orange-500 mx-auto mb-1 fill-current sm:w-6 sm:h-6" />
          <span
            className="block text-xl sm:text-2xl font-extrabold"
            style={{ color: "var(--foreground)" }}
          >
            {learner.streak}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-extrabold uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            STREAK
          </span>
        </div>

        {/* Lessons */}
        <div className="card-duo p-3 sm:p-4 text-center">
          <CheckCircle size={20} className="text-sky-500 mx-auto mb-1 sm:w-6 sm:h-6" />
          <span
            className="block text-xl sm:text-2xl font-extrabold"
            style={{ color: "var(--foreground)" }}
          >
            {completedLessons}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-extrabold uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            LESSONS
          </span>
        </div>

        {/* Skills */}
        <div className="card-duo p-3 sm:p-4 text-center">
          <Award size={20} className="text-green-500 mx-auto mb-1 sm:w-6 sm:h-6" />
          <span
            className="block text-xl sm:text-2xl font-extrabold"
            style={{ color: "var(--foreground)" }}
          >
            {completedSkills}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-extrabold uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            SKILLS
          </span>
        </div>
      </div>
    </div>
  );
};
