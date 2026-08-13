"use client";

import React from "react";
import { Unit } from "@/lib/types";

interface UnitCardProps {
  unit: Unit;
}

const unitColors = [
  "bg-green-500 border-green-600",
  "bg-sky-500 border-sky-600",
  "bg-purple-500 border-purple-600",
  "bg-amber-500 border-amber-600",
];

export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const colorClass = unitColors[(unit.order_index - 1) % unitColors.length];

  return (
    <div className={`w-full rounded-2xl p-5 text-white border-b-4 shadow-md ${colorClass} mb-6`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider opacity-90">
            {unit.title}
          </span>
          <p className="text-sm font-bold opacity-95 mt-0.5">{unit.description}</p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-xl font-extrabold text-lg">
          #{unit.order_index}
        </div>
      </div>
    </div>
  );
};
