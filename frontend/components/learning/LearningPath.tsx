"use client";

import React, { useEffect, useState } from "react";
import { Course } from "@/lib/types";
import { UnitCard } from "./UnitCard";
import { SkillNode } from "./SkillNode";

interface LearningPathProps {
  course: Course;
}

export const LearningPath: React.FC<LearningPathProps> = ({ course }) => {
  // Responsive S-curve offsets: smaller on mobile to prevent clipping
  const [offset, setOffset] = useState(45);

  useEffect(() => {
    const update = () => setOffset(window.innerWidth < 640 ? 28 : 45);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Pattern: center, right, center, left
  const offsetPattern = [0, offset, 0, -offset];

  return (
    // pb-28 ensures content clears the fixed bottom nav on mobile
    <div className="max-w-sm sm:max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-28">
      {course.units.map((unit) => (
        <section key={unit.id} className="mb-8 sm:mb-10">
          <UnitCard unit={unit} />

          <div className="flex flex-col items-center">
            {unit.skills.map((skill, index) => {
              const h = offsetPattern[index % offsetPattern.length];
              return (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  horizontalOffset={h}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
