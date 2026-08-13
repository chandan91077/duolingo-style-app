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
  const [selected, setSelected] = useState<{ id: string; word: string }[]>([]);
  const [available, setAvailable] = useState<{ id: string; word: string }[]>([]);

  useEffect(() => {
    const tokens = wordBank.map((word, idx) => ({ id: `${word}-${idx}`, word }));
    setAvailable(tokens);
    setSelected([]);
  }, [prompt, wordBank]);

  const pick = (token: { id: string; word: string }) => {
    if (disabled) return;
    const next = [...selected, token];
    setSelected(next);
    setAvailable(available.filter((t) => t.id !== token.id));
    onChange(next.map((t) => t.word).join(" "));
  };

  const drop = (token: { id: string; word: string }) => {
    if (disabled) return;
    const next = selected.filter((t) => t.id !== token.id);
    setSelected(next);
    setAvailable([...available, token]);
    onChange(next.map((t) => t.word).join(" "));
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2
        className="text-2xl font-extrabold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        {prompt}
      </h2>

      {/* Assembly tray */}
      <div className="assembly-tray p-3 flex flex-wrap items-center gap-2 mb-8">
        {selected.length === 0 ? (
          <span
            className="text-sm font-semibold italic px-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Tap words below to assemble your translation...
          </span>
        ) : (
          selected.map((token) => (
            <button
              key={token.id}
              onClick={() => drop(token)}
              disabled={disabled}
              className="word-token px-3 py-1.5 text-sm animate-pop"
            >
              {token.word}
            </button>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {available.map((token) => (
          <button
            key={token.id}
            onClick={() => pick(token)}
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
