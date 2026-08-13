"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  ChevronDown,
} from "lucide-react";
import { Learner } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

import { UserAvatar } from "@/components/common/UserAvatar";

interface TopBarProps {
  learner: Learner | null;
  onRefillClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ learner, onRefillClick }) => {
  const { dbUser, firebaseUser, logout, refillHearts } = useAuth();

  const handleHeartsClick = async () => {
    if (onRefillClick) {
      onRefillClick();
    } else {
      try {
        await refillHearts();
      } catch {
        alert("Failed to refill hearts");
      }
    }
  };
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active user data prefer Context dbUser over passed prop ONLY when authenticated
  const activeLearner = firebaseUser ? (dbUser || learner) : null;
  const userName =
    activeLearner?.name ||
    firebaseUser?.displayName ||
    (firebaseUser?.email ? firebaseUser.email.split("@")[0] : "Learner");
  const userEmail = activeLearner?.email || firebaseUser?.email || "";
  const userAvatar = activeLearner?.avatar || "🚀";

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("duo-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("duo-theme", "light");
    }
    setDark(next);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 shadow-sm"
        style={{
          backgroundColor: "var(--navigation)",
          borderColor: "var(--navigation-border)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">

          {/* Left: Language badge + theme toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language badge */}
            <div
              className="flex items-center gap-1 font-extrabold text-sm px-2 sm:px-3 py-1.5 rounded-xl cursor-pointer select-none transition"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "2px solid var(--border)",
              }}
            >
              <span className="text-base sm:text-lg">🇮🇳</span>
              <span className="hidden sm:inline tracking-wide text-xs sm:text-sm">HINDI</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl transition flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "2px solid var(--border)",
              }}
              title={mounted && dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {mounted && dark ? (
                <Sun size={16} className="text-amber-400 sm:w-[18px] sm:h-[18px]" />
              ) : (
                <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />
              )}
            </button>
          </div>

          {/* Right: Gamification stats + User Profile / Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 font-extrabold">

            {/* Streak */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl border"
              style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
              title="Daily Streak"
            >
              <span className="text-sm sm:text-base">🔥</span>
              <span className="text-orange-500 text-xs sm:text-sm">
                {activeLearner?.streak ?? 0}
              </span>
            </div>

            {/* XP */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl border"
              style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
              title="Total XP"
            >
              <span className="text-sm sm:text-base">⚡</span>
              <span className="text-amber-500 text-xs sm:text-sm">
                <span className="hidden sm:inline">{activeLearner?.totalXp ?? 0} XP</span>
                <span className="sm:hidden">{activeLearner?.totalXp ?? 0}</span>
              </span>
            </div>

            {/* Hearts */}
            <button
              onClick={handleHeartsClick}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl border transition cursor-pointer hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
              title="Hearts (Click to Refill)"
            >
              <span className="text-sm sm:text-base">❤️</span>
              <span className="text-red-500 text-xs sm:text-sm">{activeLearner?.hearts ?? 0}</span>
            </button>

            {/* Auth Dropdown or Login Button */}
            {firebaseUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl border transition cursor-pointer hover:opacity-90 shadow-xs"
                  style={{
                    backgroundColor: "var(--card-elevated)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <UserAvatar avatar={userAvatar} name={userName} sizeClass="w-5 h-5" textClass="text-sm" />
                  <span className="text-xs font-extrabold max-w-[90px] sm:max-w-[120px] truncate">
                    {userName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl p-3 shadow-2xl z-50 border-2 animate-pop"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    {/* User info / Who am I */}
                    <div className="px-2 py-2 border-b mb-2" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-2">
                        <UserAvatar avatar={userAvatar} name={userName} sizeClass="w-9 h-9" textClass="text-2xl" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-sm truncate" style={{ color: "var(--foreground)" }}>
                            {userName}
                          </p>
                          {userEmail && (
                            <p className="text-[11px] font-semibold truncate" style={{ color: "var(--muted-foreground)" }}>
                              {userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className="inline-block mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md border"
                        style={{
                          backgroundColor: "var(--card-elevated)",
                          color: "var(--sky-500, #00aaff)",
                          borderColor: "var(--border)",
                        }}
                      >
                        ✓ Logged In
                      </span>
                    </div>

                    {/* Navigation Options */}
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-extrabold transition hover:bg-gray-100 dark:hover:bg-slate-800"
                        style={{ color: "var(--foreground)" }}
                      >
                        <UserIcon size={16} className="text-sky-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-extrabold transition hover:bg-gray-100 dark:hover:bg-slate-800"
                        style={{ color: "var(--foreground)" }}
                      >
                        <SettingsIcon size={16} className="text-gray-500" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t my-2" style={{ borderColor: "var(--border)" }} />

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-extrabold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-duo-green px-3 py-1 rounded-xl font-extrabold text-xs tracking-wide uppercase cursor-pointer ml-1"
              >
                LOG IN
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
