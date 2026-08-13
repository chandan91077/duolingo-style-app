"use client";

import React, { useState, useEffect } from "react";

interface TranslateExerciseProps {
  prompt: string;
  wordBank: string[];
  onChange: (assembledSentence: string) => void;
  disabled: boolean;
}

export const TranslateExercise: React.FC<TranslateExerciseProps> = ({
  prompt,
  wordBank = [],
  onChange,
  disabled,
}) => {
  const [selectedTokens, setSelectedTokens] = useState<
    { id: string; word: string }[]
  >([]);
  const [availableTokens, setAvailableTokens] = useState<
    { id: string; word: string }[]
  >([]);

  useEffect(() => {
    // Convert string array to uniquely identifiable tokens
    const tokens = wordBank.map((word, idx) => ({
      id: `${word}-${idx}`,
      word,
    }));
    setAvailableTokens(tokens);
    setSelectedTokens([]);
  }, [prompt, wordBank]);

  const handleSelect = (token: { id: string; word: string }) => {
    if (disabled) return;
    const newSelected = [...selectedTokens, token];
    setSelectedTokens(newSelected);
    setAvailableTokens(availableTokens.filter((t) => t.id !== token.id));

    const sentence = newSelected.map((t) => t.word).join(" ");
    onChange(sentence);
  };

  const handleDeselect = (token: { id: string; word: string }) => {
    if (disabled) return;
    const newSelected = selectedTokens.filter((t) => t.id !== token.id);
    setSelectedTokens(newSelected);
    setAvailableTokens([...availableTokens, token]);

    const sentence = newSelected.map((t) => t.word).join(" ");
    onChange(sentence);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{prompt}</h2>

      {/* Assembly Area */}
      <div className="min-h-[72px] bg-white border-2 border-b-4 border-gray-200 rounded-2xl p-3 flex flex-wrap items-center gap-2 mb-8 shadow-xs">
        {selectedTokens.length === 0 ? (
          <span className="text-sm font-semibold text-gray-400 italic px-2">
            Tap words below to assemble your translation...
          </span>
        ) : (
          selectedTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => handleDeselect(token)}
              disabled={disabled}
              className="bg-sky-100 border-2 border-b-4 border-sky-300 text-sky-800 font-extrabold px-3 py-1.5 rounded-xl text-sm shadow-xs transition hover:bg-sky-200 cursor-pointer animate-pop"
            >
              {token.word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {availableTokens.map((token) => (
          <button
            key={token.id}
            onClick={() => handleSelect(token)}
            disabled={disabled}
            className="btn-duo-white px-4 py-2 rounded-xl text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
          >
            {token.word}
          </button>
        ))}
      </div>
    </div>
  );
};
