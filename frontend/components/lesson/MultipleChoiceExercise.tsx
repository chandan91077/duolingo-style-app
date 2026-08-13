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
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-8 text-center sm:text-left">
        {prompt}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              disabled={disabled}
              className={`p-4 rounded-2xl border-2 border-b-4 font-bold text-left text-base transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-sky-50 border-sky-400 text-sky-700 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              } ${disabled ? "cursor-not-allowed opacity-85" : ""}`}
            >
              <span>{option}</span>
              <span className="text-xs font-extrabold text-gray-400 border border-gray-300 rounded-md px-2 py-0.5">
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
