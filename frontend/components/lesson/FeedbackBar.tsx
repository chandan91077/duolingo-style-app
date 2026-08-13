"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface FeedbackBarProps {
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string;
  explanation?: string;
  onContinue: () => void;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  isAnswered,
  isCorrect,
  correctAnswer,
  explanation,
  onContinue,
}) => {
  if (!isAnswered) return null;

  const isSuccess = isCorrect === true;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t-2 shadow-2xl transition-all duration-300 animate-pop ${
        isSuccess
          ? "bg-green-100 border-green-300 text-green-900"
          : "bg-red-100 border-red-300 text-red-900"
      }`}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 w-full sm:w-auto">
          {isSuccess ? (
            <CheckCircle2 size={32} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle size={32} className="text-red-600 shrink-0 mt-0.5" />
          )}

          <div>
            <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
              {isSuccess ? "Correct! Excellent job!" : "Not quite!"}
            </h3>

            {!isSuccess && correctAnswer && (
              <p className="text-sm font-bold text-red-800 mt-0.5">
                Correct answer: <span className="underline">{correctAnswer}</span>
              </p>
            )}

            {explanation && (
              <p className="text-xs mt-1 text-gray-700 max-w-md">{explanation}</p>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-extrabold text-base tracking-wider uppercase shadow-md cursor-pointer transition ${
            isSuccess ? "btn-duo-green" : "btn-duo-red"
          }`}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};
