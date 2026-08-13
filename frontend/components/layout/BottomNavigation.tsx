"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User, Settings } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "LEARN", href: "/learn", icon: BookOpen, color: "text-green-500" },
    { label: "LEADERBOARD", href: "/leaderboard", icon: Trophy, color: "text-amber-500" },
    { label: "PROFILE", href: "/profile", icon: User, color: "text-sky-500" },
    { label: "SETTINGS", href: "/settings", icon: Settings, color: "text-purple-500" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 py-2 px-4 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                isActive
                  ? "bg-sky-50 text-sky-600 font-extrabold border-2 border-sky-200"
                  : "text-gray-400 hover:text-gray-600 font-bold"
              }`}
            >
              <Icon size={22} className={isActive ? item.color : "text-gray-400"} />
              <span className="text-[10px] tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
