"use client";

import React, { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onChange(val);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{prompt}</h2>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Type in Spanish..."
          className="w-full p-4 rounded-2xl border-2 border-b-4 border-gray-200 focus:border-sky-400 focus:outline-none font-bold text-lg text-gray-800 bg-white shadow-xs transition disabled:bg-gray-100 disabled:text-gray-500"
          autoFocus
        />
      </div>
    </div>
  );
};
