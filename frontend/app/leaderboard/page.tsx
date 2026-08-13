"use client";

import React, { useEffect, useState } from "react";
import { LeaderboardEntry, Learner } from "@/lib/types";
import { getLeaderboard, getLearner, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Trophy, Zap, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { AuthModal } from "@/components/auth/AuthModal";
import { UserAvatar } from "@/components/common/UserAvatar";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LeaderboardPage() {
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchLeaderboardData = async () => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [lb, l] = await Promise.all([getLeaderboard(dbUser?.id), getLearner()]);
      setLeaderboard(lb);
      setLearner(l);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchLeaderboardData();
    }
  }, [dbUser?.id, firebaseUser, authLoading]);

  const handleRefillHearts = async () => {
    try {
      const u = await refillHearts();
      setLearner(u);
    } catch {
      alert("Failed to refill hearts");
    }
  };

  if (authLoading || (loading && firebaseUser)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading leaderboard rankings...
        </p>
      </div>
    );
  }

  // Not Logged In Gate
  if (!firebaseUser) {
    return (
      <div className="min-h-screen pb-24">
        <TopBar learner={null} />

        <main className="max-w-md mx-auto px-4 pt-12 sm:pt-16 text-center">
          <div className="card-duo p-8 animate-pop">
            <span className="text-5xl mb-4 block">🏆</span>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
              Join the Leaderboard
            </h2>
            <p className="text-xs sm:text-sm font-semibold mb-6" style={{ color: "var(--muted-foreground)" }}>
              Log in or create an account to compete with other learners on the weekly global leaderboard!
            </p>

            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-duo-green w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 mb-3 cursor-pointer shadow-md"
            >
              <LogIn size={18} /> LOG IN TO COMPETE
            </button>

            <Link
              href="/learn"
              className="btn-duo-white block w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wide text-center"
            >
              EXPLORE LESSONS
            </Link>
          </div>
        </main>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <BottomNavigation />
      </div>
    );
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-lg sm:text-xl">🥇</span>;
    if (rank === 2) return <span className="text-lg sm:text-xl">🥈</span>;
    if (rank === 3) return <span className="text-lg sm:text-xl">🥉</span>;
    return (
      <span
        className="font-extrabold text-xs sm:text-sm w-5 sm:w-6 text-center tabular-nums"
        style={{ color: "var(--muted-foreground)" }}
      >
        {rank}
      </span>
    );
  };

  const currentUserEntry = leaderboard.find(
    (entry) => entry.is_current_user || entry.id === dbUser?.id
  );

  return (
    <div className="min-h-screen pb-24">
      <TopBar learner={learner} onRefillClick={handleRefillHearts} />

      {/* Responsive max-width: compact on mobile, wider on desktop */}
      <main className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* Header Banner */}
        <div className="card-duo p-4 sm:p-6 text-center mb-6 sm:mb-8">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 border-2 text-amber-500"
            style={{ backgroundColor: "var(--card-elevated)", borderColor: "var(--border)" }}
          >
            <Trophy size={24} className="sm:w-9 sm:h-9" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>
            Global Leaderboard
          </h1>
          <p className="text-xs font-bold mt-1" style={{ color: "var(--muted-foreground)" }}>
            Top learners competing this week! Complete lessons to gain XP.
          </p>
        </div>

        {/* Current User Rank Highlight Card */}
        {currentUserEntry && (
          <div
            className="card-duo p-3 sm:p-4 mb-5 border-2 flex items-center justify-between gap-3 animate-pop shadow-md"
            style={{
              borderColor: "var(--nav-active-text)",
              backgroundColor: "var(--card-elevated)",
            }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-extrabold text-xs sm:text-sm border shrink-0 bg-white dark:bg-slate-800">
                #{currentUserEntry.rank}
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl border shrink-0 overflow-hidden">
                <UserAvatar avatar={currentUserEntry.avatar} name={currentUserEntry.name} sizeClass="w-full h-full" textClass="text-base sm:text-xl" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5 truncate" style={{ color: "var(--foreground)" }}>
                  <span>{currentUserEntry.name}</span>
                  <span className="bg-sky-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">YOU</span>
                </p>
                <p className="text-[10px] sm:text-xs text-orange-500 font-bold flex items-center gap-1">
                  <Flame size={11} className="fill-current" /> {currentUserEntry.streak} day streak
                </p>
              </div>
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-amber-500 flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-xl border bg-white dark:bg-slate-800" style={{ borderColor: "var(--border)" }}>
              <Zap size={14} className="fill-current" />
              <span>{currentUserEntry.total_xp} XP</span>
            </div>
          </div>
        )}

        {/* Entries */}
        <div className="card-duo overflow-hidden divide-y" style={{ borderColor: "var(--border)" }}>
          {leaderboard.map((entry) => {
            const isMe = entry.is_current_user || entry.id === dbUser?.id;
            return (
              <div
                key={entry.id}
                className="p-3 sm:p-4 flex items-center justify-between gap-2 transition"
                style={{
                  backgroundColor: isMe ? "var(--nav-active-bg)" : "var(--card)",
                  borderLeft: isMe ? "4px solid var(--nav-active-text)" : "none",
                }}
              >
                {/* Left: rank + avatar + name */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Rank badge — fixed width so names align */}
                  <div className="w-6 sm:w-8 flex items-center justify-center shrink-0">
                    {getRankBadge(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl border shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--card-elevated)", borderColor: "var(--border)" }}
                  >
                    <UserAvatar avatar={entry.avatar} name={entry.name} sizeClass="w-full h-full" textClass="text-base sm:text-xl" />
                  </div>

                  {/* Name + streak */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Truncate long names on mobile */}
                      <span
                        className="font-extrabold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[160px]"
                        style={{ color: "var(--foreground)" }}
                      >
                        {entry.name}
                      </span>
                      {isMe && (
                        <span className="bg-sky-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-orange-500">
                      <Flame size={10} className="fill-current shrink-0" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Right: XP badge — always visible, never wraps */}
                <div
                  className="flex items-center gap-1 font-extrabold text-xs sm:text-sm text-amber-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border shrink-0"
                  style={{ backgroundColor: "var(--card-elevated)", borderColor: "var(--border)" }}
                >
                  <Zap size={13} className="fill-current sm:w-4 sm:h-4" />
                  <span className="tabular-nums">{entry.total_xp}<span className="hidden sm:inline"> XP</span></span>
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
