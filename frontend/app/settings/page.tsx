"use client";

import React, { useEffect, useState } from "react";
import { Learner } from "@/lib/types";
import { getLearner, refillHearts } from "@/lib/api";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { User, Bell, Volume2, Globe, Shield, Sparkles, ChevronRight, LogOut } from "lucide-react";

const SETTINGS_ITEMS = [
  { label: "PROFILE PREFERENCES", icon: User,    description: "Manage avatar and learner username" },
  { label: "NOTIFICATIONS",       icon: Bell,    description: "Daily practice reminders and streak alerts" },
  { label: "SOUND & AUDIO",       icon: Volume2, description: "Sound effects, listening exercises, and voice pitch" },
  { label: "LANGUAGE & COURSES",  icon: Globe,   description: "Switch target language or add a new course" },
  { label: "ACCOUNT & PRIVACY",   icon: Shield,  description: "Security settings and data controls" },
];

export default function SettingsPage() {
  const { dbUser, firebaseUser, logout } = useAuth();
  const [learner, setLearner] = useState<Learner | null>(null);

  useEffect(() => {
    getLearner().then(setLearner).catch(console.error);
  }, []);

  const activeUser = dbUser || learner;

  return (
    <div className="min-h-screen pb-24">
      <TopBar learner={learner} onRefillClick={() => refillHearts().then(setLearner)} />

      <main className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1
          className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 flex items-center gap-2"
          style={{ color: "var(--foreground)" }}
        >
          <span>⚙️</span> Settings
        </h1>

        <div className="space-y-2 sm:space-y-3">
          {SETTINGS_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-duo p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition"
              >
                {/* Icon box */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: "var(--card-elevated)",
                    borderColor: "var(--border)",
                    color: "var(--nav-active-text)",
                  }}
                >
                  <Icon size={17} className="sm:w-5 sm:h-5" />
                </div>

                {/* Text — truncate description on mobile */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-extrabold text-xs sm:text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.label}
                  </h3>
                  <p
                    className="text-[10px] sm:text-xs mt-0.5 truncate"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Badge — icon-only on mobile, text on sm+ */}
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="font-extrabold px-2 py-1 rounded-lg border flex items-center gap-1"
                    style={{
                      backgroundColor: "var(--card-elevated)",
                      color: "var(--muted-foreground)",
                      borderColor: "var(--border)",
                      fontSize: "10px",
                    }}
                  >
                    <Sparkles size={11} />
                    <span className="hidden sm:inline">SOON</span>
                  </span>
                  <ChevronRight size={14} className="sm:w-4 sm:h-4" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </div>
            );
          })}

          {/* Account Log Out Section */}
          {firebaseUser && (
            <div className="pt-4">
              <div
                className="card-duo p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between gap-4"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <div>
                  <h3 className="font-extrabold text-sm" style={{ color: "var(--foreground)" }}>
                    LOG OUT OF ACCOUNT
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    Signed in as {activeUser?.name || firebaseUser.email}
                  </p>
                </div>

                <button
                  onClick={() => logout()}
                  className="px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900 transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <LogOut size={15} />
                  <span>LOG OUT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
