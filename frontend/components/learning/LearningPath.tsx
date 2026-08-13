"use client";

import React from "react";
import { Course } from "@/lib/types";
import { UnitCard } from "./UnitCard";
import { SkillNode } from "./SkillNode";

interface LearningPathProps {
  course: Course;
}

export const LearningPath: React.FC<LearningPathProps> = ({ course }) => {
  // S-curve winding offsets for skill node positions
  const offsets = [0, 45, 0, -45];

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {course.units.map((unit) => (
        <section key={unit.id} className="mb-10">
          <UnitCard unit={unit} />

          <div className="flex flex-col items-center">
            {unit.skills.map((skill, index) => {
              const offset = offsets[index % offsets.length];
              return (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  horizontalOffset={offset}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
