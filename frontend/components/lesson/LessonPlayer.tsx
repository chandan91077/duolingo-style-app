"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lesson, LessonCompleteResponse } from "@/lib/types";
import { submitAnswer, completeLesson, refillHearts } from "@/lib/api";
import { LessonProgress } from "./LessonProgress";
import { ExerciseRenderer } from "./ExerciseRenderer";
import { FeedbackBar } from "./FeedbackBar";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { LessonCelebration } from "./LessonCelebration";

interface LessonPlayerProps {
  lesson: Lesson;
  initialHearts: number;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  initialHearts,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<{
    correctAnswer?: string;
    explanation?: string;
  }>({});
  const [hearts, setHearts] = useState(initialHearts);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionSummary, setCompletionSummary] =
    useState<LessonCompleteResponse | null>(null);

  const currentExercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;

  const handleCheck = async () => {
    if (!currentExercise || selectedAnswer === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitAnswer(
        lesson.id,
        currentExercise.id,
        selectedAnswer
      );

      setIsAnswered(true);
      setIsCorrect(res.correct);
      setFeedback({
        correctAnswer: res.correct_answer,
        explanation: res.explanation,
      });
      setHearts(res.hearts);

      if (res.hearts <= 0) {
        setShowOutOfHeartsModal(true);
      }
    } catch (err: any) {
      alert(err.message || "Error validating answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (currentIndex + 1 < totalExercises) {
      // Move to next exercise
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setFeedback({});
    } else {
      // Completed all exercises in lesson
      setIsSubmitting(true);
      try {
        const completeRes = await completeLesson(lesson.id);
        setCompletionSummary(completeRes);
        setIsCompleted(true);
      } catch (err: any) {
        alert(err.message || "Failed to finalize lesson");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRefillHearts = async () => {
    try {
      const updatedLearner = await refillHearts();
      setHearts(updatedLearner.hearts);
      setShowOutOfHeartsModal(false);
    } catch (err) {
      alert("Failed to refill hearts");
    }
  };

  if (isCompleted && completionSummary) {
    return <LessonCelebration summary={completionSummary} />;
  }

  if (!currentExercise) {
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        No exercises found in this lesson.
      </div>
    );
  }

  const isCheckEnabled =
    selectedAnswer !== null &&
    (typeof selectedAnswer === "string" ? selectedAnswer.trim() !== "" : true) &&
    !isAnswered;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 pb-32">
      {/* Top Header */}
      <LessonProgress
        currentStep={currentIndex + 1}
        totalSteps={totalExercises}
        hearts={hearts}
      />

      {/* Main Exercise View */}
      <main className="flex-1 flex items-center justify-center px-4">
        <ExerciseRenderer
          exercise={currentExercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={setSelectedAnswer}
          disabled={isAnswered || hearts <= 0}
        />
      </main>

      {/* Bottom Action Footer (Before Answer Submission) */}
      {!isAnswered && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 p-4">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button
              onClick={handleCheck}
              disabled={!isCheckEnabled || isSubmitting}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-base tracking-wider uppercase shadow-md cursor-pointer transition ${
                isCheckEnabled
                  ? "btn-duo-green"
                  : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "CHECKING..." : "CHECK"}
            </button>
          </div>
        </footer>
      )}

      {/* Bottom Feedback Bar (After Answer Submission) */}
      <FeedbackBar
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        correctAnswer={feedback.correctAnswer}
        explanation={feedback.explanation}
        onContinue={handleContinue}
      />

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        onRefill={handleRefillHearts}
      />
    </div>
  );
};
