"use client";

import React, { useEffect, useState, use } from "react";
import { Lesson, Learner } from "@/lib/types";
import { getLesson, getLearner } from "@/lib/api";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.lessonId, 10);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [learner, setLearner] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
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

    if (lessonId) {
      loadData();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-extrabold text-gray-600 text-sm">Preparing your lesson...</p>
      </div>
    );
  }

  if (error || !lesson || !learner) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="card-duo p-8 max-w-sm w-full">
          <span className="text-4xl mb-3 block">❌</span>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">Lesson Unavailable</h2>
          <p className="text-xs text-gray-500 mb-6">{error || "Could not load lesson data."}</p>
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
