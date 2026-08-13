"use client";

import React, { useEffect, useState } from "react";
import { Learner } from "@/lib/types";
import { getLearner, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { User, Bell, Volume2, Globe, Shield, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [learner, setLearner] = useState<Learner | null>(null);

  useEffect(() => {
    getLearner().then(setLearner).catch(console.error);
  }, []);

  const settingsItems = [
    { label: "PROFILE PREFERENCES", icon: User, description: "Manage avatar and learner username" },
    { label: "NOTIFICATIONS", icon: Bell, description: "Daily practice reminders and streak alerts" },
    { label: "SOUND & AUDIO", icon: Volume2, description: "Sound effects, listening exercises, and voice pitch" },
    { label: "LANGUAGE & COURSES", icon: Globe, description: "Switch target language or add a new course" },
    { label: "ACCOUNT & PRIVACY", icon: Shield, description: "Security settings and data controls" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopBar learner={learner} onRefillClick={() => refillHearts().then(setLearner)} />

      <main className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span>⚙️</span> Settings
        </h1>

        <div className="space-y-4">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-duo p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-800">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>

                <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1 shrink-0">
                  <Sparkles size={12} /> COMING SOON
                </span>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
