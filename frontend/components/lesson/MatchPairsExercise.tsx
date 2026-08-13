"use client";

import React, { useState, useEffect } from "react";

interface MatchPairsProps {
  prompt: string;
  pairsDict: Record<string, string>;
  onChange: (matched: Record<string, string>) => void;
  disabled: boolean;
}

export const MatchPairsExercise: React.FC<MatchPairsProps> = ({
  prompt,
  pairsDict = {},
  onChange,
  disabled,
}) => {
  const [leftSelected, setLeftSelected]   = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched]             = useState<Record<string, string>>({});
  const [leftWords, setLeftWords]         = useState<string[]>([]);
  const [rightWords, setRightWords]       = useState<string[]>([]);

  useEffect(() => {
    setLeftWords(Object.keys(pairsDict));
    setRightWords([...Object.values(pairsDict)].sort(() => Math.random() - 0.5));
    setMatched({});
    setLeftSelected(null);
    setRightSelected(null);
  }, [prompt, pairsDict]);

  const checkPair = (left: string, right: string) => {
    if (pairsDict[left] === right) {
      const next = { ...matched, [left]: right };
      setMatched(next);
      setLeftSelected(null);
      setRightSelected(null);
      onChange(next);
    } else {
      setTimeout(() => { setLeftSelected(null); setRightSelected(null); }, 400);
    }
  };

  const handleLeft = (word: string) => {
    if (disabled || matched[word]) return;
    setLeftSelected(word);
    if (rightSelected) checkPair(word, rightSelected);
  };

  const handleRight = (word: string) => {
    if (disabled || Object.values(matched).includes(word)) return;
    setRightSelected(word);
    if (leftSelected) checkPair(leftSelected, word);
  };

  const btnClass = (isMatched: boolean, isSelected: boolean) => {
    let cls = "choice-btn p-3 sm:p-3.5 text-xs sm:text-sm text-center font-bold min-h-[48px] sm:min-h-[52px] flex items-center justify-center";
    if (isMatched) cls += " matched";
    else if (isSelected) cls += " selected";
    return cls;
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-6 px-1">
      <h2
        className="text-xl sm:text-2xl font-extrabold mb-6 leading-snug"
        style={{ color: "var(--foreground)" }}
      >
        {prompt}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {leftWords.map((word) => (
            <button
              key={word}
              onClick={() => handleLeft(word)}
              disabled={disabled || !!matched[word]}
              className={btnClass(!!matched[word], leftSelected === word)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {rightWords.map((word) => (
            <button
              key={word}
              onClick={() => handleRight(word)}
              disabled={disabled || Object.values(matched).includes(word)}
              className={btnClass(Object.values(matched).includes(word), rightSelected === word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
