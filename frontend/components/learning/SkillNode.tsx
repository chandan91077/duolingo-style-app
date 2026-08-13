"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Check, Star, Play, Award } from "lucide-react";
import { Skill } from "@/lib/types";
import { ProgressRing } from "./ProgressRing";

interface SkillNodeProps {
  skill: Skill;
  horizontalOffset?: number; // For playful winding path effect (-40px, 0px, 40px)
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  horizontalOffset = 0,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  const activeLesson = skill.lessons.find((l) => !l.is_completed) || skill.lessons[0];

  const handleClick = () => {
    if (!skill.is_locked) {
      setShowPopover(!showPopover);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center my-4"
      style={{ transform: `translateX(${horizontalOffset}px)` }}
    >
      {/* Popover Card */}
      {showPopover && !skill.is_locked && (
        <div className="absolute bottom-24 z-30 w-64 bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-xl text-center animate-pop">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-extrabold text-lg text-gray-800">{skill.title}</h4>
            {skill.is_completed && <CrownBadge />}
          </div>
          <p className="text-xs text-gray-500 mb-3">{skill.description}</p>

          <div className="text-xs font-bold text-gray-600 mb-3 bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-200">
            Progress: {skill.completed_lessons} / {skill.total_lessons} Lessons
          </div>

          {activeLesson ? (
            <Link
              href={`/lesson/${activeLesson.id}`}
              className="btn-duo-green block w-full py-2.5 rounded-xl font-extrabold text-sm tracking-wide uppercase shadow-md text-center"
            >
              {skill.is_completed ? "PRACTICE +5 XP" : "START +15 XP"}
            </Link>
          ) : (
            <button disabled className="btn-duo-white w-full py-2 rounded-xl text-xs font-bold">
              No Lessons Available
            </button>
          )}
        </div>
      )}

      {/* Main Node Button */}
      <ProgressRing progress={skill.is_completed ? 100 : skill.progress} radius={46} stroke={6}>
        <button
          onClick={handleClick}
          disabled={skill.is_locked}
          className={`w-18 h-18 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer ${
            skill.is_locked
              ? "bg-gray-300 border-b-4 border-gray-400 text-gray-500 cursor-not-allowed"
              : skill.is_completed
              ? "bg-amber-400 border-b-4 border-amber-500 text-white"
              : "bg-green-500 border-b-4 border-green-600 text-white animate-bounce-subtle"
          }`}
        >
          {skill.is_locked ? (
            <Lock size={26} className="text-gray-400" />
          ) : skill.is_completed ? (
            <Award size={30} className="text-white" />
          ) : (
            <Star size={30} className="text-white fill-current" />
          )}
        </button>
      </ProgressRing>

      {/* Title Label below */}
      <span
        className={`mt-2 text-xs font-extrabold max-w-[120px] text-center truncate ${
          skill.is_locked ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {skill.title}
      </span>
    </div>
  );
};

const CrownBadge = () => (
  <span className="bg-amber-100 text-amber-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
    👑 1
  </span>
);
