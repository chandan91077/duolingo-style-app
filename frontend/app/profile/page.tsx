"use client";

import React, { useEffect, useState } from "react";
import { ProfileData, Learner } from "@/lib/types";
import { getProfile, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AchievementCard } from "@/components/profile/AchievementCard";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function ProfilePage() {
  const { firebaseUser, dbUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchProfileData = async () => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchProfileData();
    }
  }, [dbUser?.id, firebaseUser, authLoading]);

  const handleRefillHearts = async () => {
    try {
      await refillHearts();
      fetchProfileData();
    } catch {
      alert("Failed to refill hearts");
    }
  };

  if (authLoading || (loading && firebaseUser)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading your profile...
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
            <span className="text-5xl mb-4 block">👤</span>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
              Create a profile
            </h2>
            <p className="text-xs sm:text-sm font-semibold mb-6" style={{ color: "var(--muted-foreground)" }}>
              Log in or create an account to view your streak, XP total, completed skills, and unlocked achievements!
            </p>

            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-duo-green w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 mb-3 cursor-pointer shadow-md"
            >
              <LogIn size={18} /> LOG IN / CREATE ACCOUNT
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

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="card-duo p-8 max-w-sm w-full">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="text-xl font-extrabold mb-2">Error Loading Profile</h2>
          <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)" }}>{error}</p>
          <button
            onClick={fetchProfileData}
            className="btn-duo-green w-full py-3 rounded-xl font-extrabold text-sm uppercase"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const learner: Learner = {
    id: profile.learner.id,
    name: profile.learner.name,
    email: profile.learner.email,
    avatar: profile.learner.avatar,
    totalXp: profile.learner.total_xp,
    streak: profile.learner.streak,
    hearts: profile.learner.hearts,
    gems: profile.learner.gems,
    dailyXpGoal: profile.learner.daily_xp_goal,
    todayXp: profile.today_xp,
  };

  return (
    <div className="min-h-screen pb-24">
      <TopBar learner={learner} onRefillClick={handleRefillHearts} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <ProfileStats
          learner={learner}
          completedSkills={profile.completed_skills}
          completedLessons={profile.completed_lessons}
          todayXp={profile.today_xp}
          dailyGoalPercentage={profile.daily_goal_percentage}
        />

        {/* Achievements Section */}
        <section className="mt-8">
          <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span style={{ color: "var(--foreground)" }}>Achievements</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
