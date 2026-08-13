"use client";

import React, { useEffect, useState } from "react";
import { Learner, Course } from "@/lib/types";
import { getLearner, getCourse, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { LearningPath } from "@/components/learning/LearningPath";
import { useAuth } from "@/context/AuthContext";

export default function LearnPage() {
  const { dbUser } = useAuth();
  const [learner, setLearner] = useState<Learner | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [learnerData, courseData] = await Promise.all([
        getLearner(),
        getCourse(),
      ]);
      setLearner(learnerData);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message || "Failed to load learning path");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dbUser?.id]);

  const handleRefillHearts = async () => {
    try {
      const updated = await refillHearts();
      setLearner(updated);
    } catch {
      alert("Failed to refill hearts");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading your learning path...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="card-duo p-8 max-w-sm w-full">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="text-xl font-extrabold mb-2">Something went wrong</h2>
          <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)" }}>
            {error || "Could not load course path."}
          </p>
          <button
            onClick={fetchData}
            className="btn-duo-green w-full py-3 rounded-xl font-extrabold text-sm uppercase"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar learner={learner} onRefillClick={handleRefillHearts} />
      <main className="max-w-2xl mx-auto pt-4">
        <LearningPath course={course} />
      </main>
      <BottomNavigation />
    </div>
  );
}
