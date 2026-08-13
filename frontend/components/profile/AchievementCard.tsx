"use client";

import React from "react";
import { Zap, Flame, Star, Award, Lock } from "lucide-react";
import { Achievement } from "@/lib/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case "flame": return <Flame size={24} className="text-orange-500 fill-current" />;
      case "star":  return <Star  size={24} className="text-amber-500 fill-current" />;
      case "award": return <Award size={24} className="text-purple-500" />;
      case "zap":
      default:      return <Zap   size={24} className="text-yellow-500 fill-current" />;
    }
  };

  return (
    <div
      className="card-duo p-4 flex items-center gap-4 transition"
      style={{ opacity: achievement.earned ? 1 : 0.55 }}
    >
      {/* Icon box */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0"
        style={{
          backgroundColor: achievement.earned ? "var(--card-elevated)" : "var(--muted)",
          borderColor: achievement.earned ? "var(--border)" : "var(--border)",
        }}
      >
        {achievement.earned ? getIcon() : <Lock size={22} style={{ color: "var(--muted-foreground)" }} />}
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4
            className="font-extrabold text-base"
            style={{ color: "var(--foreground)" }}
          >
            {achievement.name}
          </h4>
          {achievement.earned && (
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: "var(--card-elevated)",
                color: "var(--nav-active-text)",
                border: "1px solid var(--border)",
              }}
            >
              UNLOCKED
            </span>
          )}
        </div>
        <p
          className="text-xs font-semibold mt-0.5"
          style={{ color: "var(--muted-foreground)" }}
        >
          {achievement.description}
        </p>
      </div>
    </div>
  );
};
