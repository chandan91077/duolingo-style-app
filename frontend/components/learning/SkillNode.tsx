"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Star, Award } from "lucide-react";
import { Skill } from "@/lib/types";
import { ProgressRing } from "./ProgressRing";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface SkillNodeProps {
  skill: Skill;
  horizontalOffset?: number;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  horizontalOffset = 0,
}) => {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [showPopover, setShowPopover] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const activeLesson =
    skill.lessons.find((l) => !l.is_completed) || skill.lessons[0];

  const handleClick = (e: React.MouseEvent) => {
    if (!skill.is_locked) {
      handleStartLesson(e);
    }
  };

  const handleStartLesson = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeLesson) return;

    if (!firebaseUser) {
      setShowAuthModal(true);
    } else {
      router.push(`/lesson/${activeLesson.id}`);
    }
  };

  return (
    <>
      <div
        className="relative flex flex-col items-center my-4"
        style={{ transform: `translateX(${horizontalOffset}px)` }}
      >
        {/* Popover */}
        {showPopover && !skill.is_locked && (
          <div
            className="absolute bottom-24 z-30 w-64 rounded-2xl p-4 shadow-xl text-center animate-pop border-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-base" style={{ color: "var(--foreground)" }}>
                {skill.title}
              </h4>
              {skill.is_completed && (
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1"
                  style={{
                    backgroundColor: "var(--card-elevated)",
                    color: "var(--nav-active-text)",
                    borderColor: "var(--border)",
                  }}
                >
                  👑 1
                </span>
              )}
            </div>

            <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>
              {skill.description}
            </p>

            <div
              className="text-xs font-bold mb-3 py-1.5 px-3 rounded-lg border"
              style={{
                backgroundColor: "var(--card-elevated)",
                color: "var(--muted-foreground)",
                borderColor: "var(--border)",
              }}
            >
              Progress: {skill.completed_lessons} / {skill.total_lessons} Lessons
            </div>

            {activeLesson ? (
              <button
                onClick={handleStartLesson}
                className="btn-duo-green block w-full py-2.5 rounded-xl font-extrabold text-sm tracking-wide uppercase shadow-md text-center cursor-pointer"
              >
                {skill.is_completed ? "PRACTICE +5 XP" : "START +15 XP"}
              </button>
            ) : (
              <button
                disabled
                className="btn-duo-white w-full py-2 rounded-xl text-xs font-bold"
              >
                No Lessons Available
              </button>
            )}
          </div>
        )}

      {/* Node Button */}
      <ProgressRing
        progress={skill.is_completed ? 100 : skill.progress}
        radius={46}
        stroke={6}
      >
        <button
          onClick={handleClick}
          disabled={skill.is_locked}
          className={`w-18 h-18 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer ${
            skill.is_locked
              ? "cursor-not-allowed"
              : skill.is_completed
              ? "bg-amber-400 border-b-4 border-amber-500 text-white"
              : "bg-green-500 border-b-4 border-green-600 text-white animate-bounce-subtle"
          }`}
          style={
            skill.is_locked
              ? {
                  backgroundColor: "var(--border)",
                  borderBottom: "4px solid var(--card-border)",
                  color: "var(--muted-foreground)",
                }
              : {}
          }
        >
          {skill.is_locked ? (
            <Lock size={26} style={{ color: "var(--muted-foreground)" }} />
          ) : skill.is_completed ? (
            <Award size={30} className="text-white" />
          ) : (
            <Star size={30} className="text-white fill-current" />
          )}
        </button>
      </ProgressRing>

      {/* Label */}
      <span
        className="mt-2 text-xs font-extrabold max-w-[120px] text-center truncate"
        style={{
          color: skill.is_locked ? "var(--muted-foreground)" : "var(--foreground)",
        }}
      >
        {skill.title}
      </span>
    </div>

    {/* Auth Modal required before starting test/quiz */}
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      title="Log in to start quiz"
      subtitle="Please log in or create an account to start your lesson test."
      onSuccess={() => {
        if (activeLesson) {
          router.push(`/lesson/${activeLesson.id}`);
        }
      }}
    />
    </>
  );
};
