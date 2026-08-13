"use client";

import React, { useState, useEffect } from "react";

interface FillBlankProps {
  prompt: string;
  sentence: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const FillBlankExercise: React.FC<FillBlankProps> = ({
  prompt,
  sentence,
  onChange,
  disabled,
}) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput("");
  }, [prompt, sentence]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    onChange(val.trim());
  };

  const parts = sentence.split("___");

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold mb-8" style={{ color: "var(--foreground)" }}>
        {prompt}
      </h2>

      <div
        className="text-xl font-bold flex flex-wrap items-center gap-3 mb-8 p-5 rounded-2xl border-2"
        style={{
          backgroundColor: "var(--card-elevated)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <span>{part}</span>
            {idx < parts.length - 1 && (
              <input
                type="text"
                value={input}
                onChange={handleChange}
                disabled={disabled}
                placeholder="..."
                className="theme-input w-36 px-3 py-1.5 rounded-xl text-lg font-extrabold"
                autoFocus={idx === 0}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
