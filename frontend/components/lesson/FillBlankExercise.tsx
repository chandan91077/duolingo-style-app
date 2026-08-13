"use client";

import React from "react";

interface FillBlankProps {
  prompt: string; // e.g. "Yo ___ estudiante."
  options: string[];
  selectedAnswer: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}

export const FillBlankExercise: React.FC<FillBlankProps> = ({
  prompt,
  options = [],
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  // Render prompt string with filled blank slot
  const parts = prompt.split("___");

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4">
        Fill in the blank
      </h3>

      {/* Sentence Box */}
      <div className="bg-white border-2 border-b-4 border-gray-200 rounded-2xl p-6 text-xl sm:text-2xl font-extrabold text-gray-800 mb-8 flex items-center justify-center flex-wrap gap-2 text-center">
        <span>{parts[0]}</span>
        <span
          className={`min-w-[80px] px-3 py-1 rounded-xl border-b-4 border-2 font-bold text-center inline-block transition ${
            selectedAnswer
              ? "bg-sky-100 border-sky-400 text-sky-800"
              : "bg-gray-100 border-gray-300 text-transparent"
          }`}
        >
          {selectedAnswer || "blank"}
        </span>
        <span>{parts[1] || ""}</span>
      </div>

      {/* Option Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              disabled={disabled}
              className={`py-3.5 px-4 rounded-xl border-2 border-b-4 font-bold text-base transition cursor-pointer text-center ${
                isSelected
                  ? "bg-sky-100 border-sky-400 text-sky-800 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
