"use client";

import React from "react";

interface MultipleChoiceProps {
  prompt: string;
  options: string[];
  selectedAnswer: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceProps> = ({
  prompt,
  options = [],
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-6 px-1">
      <h2
        className="text-xl sm:text-2xl font-extrabold mb-6 sm:mb-8 text-center sm:text-left leading-snug"
        style={{ color: "var(--foreground)" }}
      >
        {prompt}
      </h2>

      {/* 1-col on mobile, 2-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              disabled={disabled}
              className={`choice-btn p-3.5 sm:p-4 font-bold text-left text-sm sm:text-base flex items-center justify-between min-h-[52px] ${
                isSelected ? "selected" : ""
              } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <span>{option}</span>
              <span
                className="text-[10px] font-extrabold border rounded-md px-1.5 py-0.5 shrink-0 ml-2"
                style={{
                  color: "var(--muted-foreground)",
                  borderColor: "var(--border)",
                }}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
