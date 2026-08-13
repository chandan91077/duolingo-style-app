"use client";

import React from "react";
import { Exercise } from "@/lib/types";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { TranslateExercise } from "./TranslateExercise";
import { MatchPairsExercise } from "./MatchPairsExercise";
import { FillBlankExercise } from "./FillBlankExercise";
import { TypeAnswerExercise } from "./TypeAnswerExercise";

interface ExerciseRendererProps {
  exercise: Exercise;
  selectedAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled: boolean;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceExercise
          prompt={exercise.prompt}
          options={Array.isArray(exercise.options) ? exercise.options : []}
          selectedAnswer={selectedAnswer}
          onSelect={onAnswerChange}
          disabled={disabled}
        />
      );

    case "translate":
      return (
        <TranslateExercise
          prompt={exercise.prompt}
          wordBank={Array.isArray(exercise.options) ? exercise.options : []}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "match_pairs":
      return (
        <MatchPairsExercise
          prompt={exercise.prompt}
          pairsDict={
            typeof exercise.options === "object" && exercise.options !== null
              ? (exercise.options as Record<string, string>)
              : {}
          }
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "fill_blank":
      return (
        <FillBlankExercise
          prompt="Fill in the blank:"
          sentence={exercise.prompt}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "type_answer":
      return (
        <TypeAnswerExercise
          prompt={exercise.prompt}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    default:
      return (
        <div className="p-8 text-center text-red-500 font-bold">
          Unsupported exercise type: {exercise.type}
        </div>
      );
  }
};
