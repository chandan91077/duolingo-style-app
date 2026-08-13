"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, LessonCompleteResponse } from "@/lib/types";
import { submitAnswer, completeLesson } from "@/lib/api";
import { LessonProgress } from "./LessonProgress";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { FeedbackBar } from "./FeedbackBar";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { LessonCelebration } from "./LessonCelebration";

import { useAuth } from "@/context/AuthContext";

interface LessonPlayerProps {
  lesson: Lesson;
  initialHearts?: number;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  initialHearts = 5,
}) => {
  const router = useRouter();
  const { refreshUser, refillHearts: contextRefillHearts } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<{ correctAnswer?: string; explanation?: string }>({});
  const [hearts, setHearts] = useState(initialHearts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<LessonCompleteResponse | null>(null);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;

  const handleCheck = async () => {
    if (!currentExercise || selectedAnswer === null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await submitAnswer(lesson.id, currentExercise.id, selectedAnswer);
      setIsAnswered(true);
      setIsCorrect(res.correct);
      setFeedback({ correctAnswer: res.correct_answer, explanation: res.explanation });
      setHearts(res.hearts);
      refreshUser();
      if (res.hearts <= 0) setShowOutOfHeartsModal(true);
    } catch (err: any) {
      alert(err.message || "Error validating answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (currentIndex + 1 < totalExercises) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setFeedback({});
    } else {
      setIsSubmitting(true);
      try {
        const completeRes = await completeLesson(lesson.id);
        setCompletionSummary(completeRes);
        setIsCompleted(true);
        refreshUser();
      } catch (err: any) {
        alert(err.message || "Failed to finalize lesson");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRefillHearts = async () => {
    try {
      const updatedLearner = await contextRefillHearts();
      setHearts(updatedLearner.hearts);
      setShowOutOfHeartsModal(false);
    } catch {
      alert("Failed to refill hearts");
    }
  };

  if (isCompleted && completionSummary) {
    return <LessonCelebration summary={completionSummary} />;
  }

  if (!currentExercise) {
    return (
      <div
        className="p-12 text-center font-bold"
        style={{ color: "var(--muted-foreground)" }}
      >
        No exercises found in this lesson.
      </div>
    );
  }

  const isCheckEnabled =
    selectedAnswer !== null &&
    (typeof selectedAnswer === "string" ? selectedAnswer.trim() !== "" : true) &&
    !isAnswered;

  return (
    <div className="min-h-screen flex flex-col justify-between pb-32">
      <LessonProgress
        currentStep={currentIndex + 1}
        totalSteps={totalExercises}
        hearts={hearts}
      />

      <main className="flex-1 flex items-center justify-center px-4">
        <ExerciseRenderer
          exercise={currentExercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={setSelectedAnswer}
          disabled={isAnswered || hearts <= 0}
        />
      </main>

      {/* Check footer */}
      {!isAnswered && (
        <footer
          className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4 border-t-2"
          style={{
            backgroundColor: "var(--navigation)",
            borderColor: "var(--navigation-border)",
          }}
        >
          <div className="max-w-2xl mx-auto flex justify-stretch sm:justify-end">
            <button
              onClick={handleCheck}
              disabled={!isCheckEnabled || isSubmitting}
              className={`w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-2xl font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-md cursor-pointer transition ${
                isCheckEnabled ? "btn-duo-green" : "cursor-not-allowed"
              }`}
              style={
                !isCheckEnabled
                  ? {
                      backgroundColor: "var(--card-elevated)",
                      color: "var(--muted-foreground)",
                      border: "2px solid var(--border)",
                    }
                  : {}
              }
            >
              {isSubmitting ? "CHECKING..." : "CHECK"}
            </button>
          </div>
        </footer>
      )}

      <FeedbackBar
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={feedback.correctAnswer}
        explanation={feedback.explanation}
        onContinue={handleContinue}
      />

      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        onRefill={handleRefillHearts}
      />
    </div>
  );
};
