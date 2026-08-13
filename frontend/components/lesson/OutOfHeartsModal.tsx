"use client";

import React from "react";
import Link from "next/link";
import { HeartOff, RefreshCw, Home } from "lucide-react";

interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefill: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onRefill,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-pop">
      <div
        className="rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border-4 shadow-2xl"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 text-red-500"
          style={{
            backgroundColor: "var(--wrong-bg)",
            borderColor: "var(--wrong-border)",
          }}
        >
          <HeartOff size={40} />
        </div>

        <h2
          className="text-2xl font-extrabold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Out of Hearts!
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
          You need hearts to keep practicing new lessons. Refill your hearts for
          free or return home.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRefill}
            className="btn-duo-green w-full py-3.5 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={18} /> REFILL HEARTS (5/5)
          </button>

          <Link
            href="/learn"
            className="btn-duo-white w-full py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Home size={18} /> RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
};
