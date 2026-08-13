"use client";

import React, { useEffect, useState, use } from "react";
import { Lesson, Learner } from "@/lib/types";
import { getLesson, getLearner } from "@/lib/api";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.lessonId, 10);

  const { firebaseUser, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [lessonData, learnerData] = await Promise.all([
          getLesson(lessonId),
          getLearner(),
        ]);
        setLesson(lessonData);
        setLearner(learnerData);
      } catch (err: any) {
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }
    if (lessonId && !authLoading) {
      loadData();
    }
  }, [lessonId, firebaseUser, authLoading]);

  if (authLoading || (loading && firebaseUser)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-sm" style={{ color: "var(--muted-foreground)" }}>
          Preparing your lesson...
        </p>
      </div>
    );
  }

  // Not logged in gate
  if (!firebaseUser) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="card-duo p-8 max-w-md w-full animate-pop">
            <span className="text-5xl mb-4 block">🔐</span>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--foreground)" }}>
              Login Required
            </h2>
            <p className="text-sm font-bold mb-6" style={{ color: "var(--muted-foreground)" }}>
              Please log in or create an account before starting this test or quiz!
            </p>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-duo-green w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 mb-3 cursor-pointer shadow-md"
            >
              <LogIn size={18} /> LOG IN TO START QUIZ
            </button>

            <Link
              href="/learn"
              className="btn-duo-white block w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wide text-center"
            >
              RETURN TO LEARNING PATH
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="Log in to start quiz"
          subtitle="Please sign in or create an account to start your lesson test."
        />
      </>
    );
  }

  if (error || !lesson || !learner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="card-duo p-8 max-w-sm w-full">
          <span className="text-4xl mb-3 block">❌</span>
          <h2 className="text-xl font-extrabold mb-2">Lesson Unavailable</h2>
          <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)" }}>
            {error || "Could not load lesson data."}
          </p>
          <a
            href="/learn"
            className="btn-duo-blue block w-full py-3 rounded-xl font-extrabold text-sm uppercase text-center"
          >
            RETURN HOME
          </a>
        </div>
      </div>
    );
  }

  return <LessonPlayer lesson={lesson} initialHearts={learner.hearts} />;
}
