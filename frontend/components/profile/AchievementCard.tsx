"use client";

import React from "react";
import { Zap, Flame, Star, Award, Lock } from "lucide-react";
import { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
}) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case "flame":
        return <Flame size={24} className="text-orange-500 fill-current" />;
      case "star":
        return <Star size={24} className="text-amber-500 fill-current" />;
      case "award":
        return <Award size={24} className="text-purple-500" />;
      case "zap":
      default:
        return <Zap size={24} className="text-yellow-500 fill-current" />;
    }
  };

  return (
    <div
      className={`card-duo p-4 flex items-center gap-4 transition ${
        achievement.earned
          ? "bg-white border-gray-200"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
          achievement.earned
            ? "bg-amber-50 border-amber-300 shadow-sm"
            : "bg-gray-200 border-gray-300 text-gray-400"
        }`}
      >
        {achievement.earned ? getIcon() : <Lock size={22} className="text-gray-400" />}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-base text-gray-800">{achievement.name}</h4>
          {achievement.earned && (
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
              UNLOCKED
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">{achievement.description}</p>
      </div>
    </div>
  );
};
