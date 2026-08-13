"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User, Settings } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "LEARN",       href: "/learn",       icon: BookOpen },
    { label: "LEADERBOARD", href: "/leaderboard", icon: Trophy   },
    { label: "PROFILE",     href: "/profile",     icon: User     },
    { label: "SETTINGS",    href: "/settings",    icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 py-1.5 sm:py-2 px-2 sm:px-4 shadow-md nav-container"
      style={{ borderColor: "var(--navigation-border)" }}
    >
      {/* max-w-lg so items spread comfortably on tablet too */}
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 rounded-xl transition min-w-[52px] sm:min-w-[64px] ${
                isActive ? "nav-link active" : "nav-link"
              }`}
            >
              {/* Icon — slightly smaller on mobile */}
              <Icon
                size={20}
                className="sm:w-[22px] sm:h-[22px]"
                style={{ color: isActive ? "var(--nav-active-text)" : "var(--nav-inactive)" }}
              />
              {/* Label — smaller on mobile, abbreviate LEADERBOARD */}
              <span
                className="text-[8px] sm:text-[10px] tracking-wider font-extrabold leading-none text-center"
                style={{ color: isActive ? "var(--nav-active-text)" : "var(--nav-inactive)" }}
              >
                {/* Abbreviate "LEADERBOARD" to "RANKS" on mobile */}
                <span className="sm:hidden">
                  {item.label === "LEADERBOARD" ? "RANKS" : item.label}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
