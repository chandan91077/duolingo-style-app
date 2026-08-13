"use client";

import React from "react";
import Link from "next/link";
import { X, Heart } from "lucide-react";

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  hearts: number;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({
  currentStep,
  totalSteps,
  hearts,
}) => {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <header className="w-full max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
      {/* Exit Button */}
      <Link
        href="/learn"
        className="text-gray-400 hover:text-gray-600 transition p-1"
        title="Quit lesson"
      >
        <X size={26} />
      </Link>

      {/* Progress Bar Track */}
      <div className="flex-1 h-3.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Hearts Counter */}
      <div className="flex items-center gap-1.5 font-extrabold text-red-500 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
        <Heart size={20} className="fill-current text-red-500" />
        <span className="text-sm">{hearts}</span>
      </div>
    </header>
  );
};
