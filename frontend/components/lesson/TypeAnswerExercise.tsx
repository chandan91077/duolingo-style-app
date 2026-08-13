"use client";

import React, { useState, useEffect } from "react";

interface TypeAnswerProps {
  prompt: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const TypeAnswerExercise: React.FC<TypeAnswerProps> = ({
  prompt,
  onChange,
  disabled,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => { setValue(""); }, [prompt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onChange(val);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold mb-6" style={{ color: "var(--foreground)" }}>
        {prompt}
      </h2>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Type your answer..."
        className="theme-input w-full p-4 rounded-2xl font-bold text-lg shadow-xs transition"
        autoFocus
      />
    </div>
  );
};
