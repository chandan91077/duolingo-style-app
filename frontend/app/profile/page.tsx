"use client";

import React, { useEffect, useState } from "react";
import { ProfileData, Learner } from "@/lib/types";
import { getProfile, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AchievementCard } from "@/components/profile/AchievementCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
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
    fetchProfileData();
  }, []);

  const handleRefillHearts = async () => {
    try {
      await refillHearts();
      fetchProfileData();
    } catch (err) {
      alert("Failed to refill hearts");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-gray-600 text-sm">Loading your profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="card-duo p-8 max-w-sm w-full">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-xs text-gray-500 mb-6">{error}</p>
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
    <div className="min-h-screen bg-gray-50 pb-24">
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
          <h3 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏆</span> Achievements
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
