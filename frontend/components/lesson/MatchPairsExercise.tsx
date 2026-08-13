"use client";

import React, { useState, useEffect } from "react";

interface MatchPairsProps {
  prompt: string;
  pairsDict: Record<string, string>; // e.g. { "Hello": "Hola", "Thank you": "Gracias" }
  onChange: (matchedPairsDict: Record<string, string>) => void;
  disabled: boolean;
}

export const MatchPairsExercise: React.FC<MatchPairsProps> = ({
  prompt,
  pairsDict = {},
  onChange,
  disabled,
}) => {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);

  useEffect(() => {
    const lefts = Object.keys(pairsDict);
    const rights = Object.values(pairsDict);
    // Shuffle right column for matching challenge
    setLeftWords(lefts);
    setRightWords([...rights].sort(() => Math.random() - 0.5));
    setMatched({});
    setLeftSelected(null);
    setRightSelected(null);
  }, [prompt, pairsDict]);

  const handleLeftClick = (word: string) => {
    if (disabled || matched[word]) return;
    setLeftSelected(word);

    if (rightSelected) {
      checkPair(word, rightSelected);
    }
  };

  const handleRightClick = (word: string) => {
    if (disabled || Object.values(matched).includes(word)) return;
    setRightSelected(word);

    if (leftSelected) {
      checkPair(leftSelected, word);
    }
  };

  const checkPair = (left: string, right: string) => {
    const expectedRight = pairsDict[left];

    if (expectedRight === right) {
      const newMatched = { ...matched, [left]: right };
      setMatched(newMatched);
      setLeftSelected(null);
      setRightSelected(null);
      onChange(newMatched);
    } else {
      // Flash temporary mismatch and reset
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
      }, 400);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{prompt}</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftWords.map((word) => {
            const isMatched = !!matched[word];
            const isSelected = leftSelected === word;

            return (
              <button
                key={word}
                onClick={() => handleLeftClick(word)}
                disabled={disabled || isMatched}
                className={`p-3.5 rounded-2xl border-2 border-b-4 font-bold text-sm text-center transition cursor-pointer ${
                  isMatched
                    ? "bg-green-100 border-green-300 text-green-700 opacity-60"
                    : isSelected
                    ? "bg-sky-100 border-sky-400 text-sky-800 shadow-md scale-102"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightWords.map((word) => {
            const isMatched = Object.values(matched).includes(word);
            const isSelected = rightSelected === word;

            return (
              <button
                key={word}
                onClick={() => handleRightClick(word)}
                disabled={disabled || isMatched}
                className={`p-3.5 rounded-2xl border-2 border-b-4 font-bold text-sm text-center transition cursor-pointer ${
                  isMatched
                    ? "bg-green-100 border-green-300 text-green-700 opacity-60"
                    : isSelected
                    ? "bg-sky-100 border-sky-400 text-sky-800 shadow-md scale-102"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
