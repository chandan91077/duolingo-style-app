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
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border-4 border-gray-200 shadow-2xl">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200 text-red-500">
          <HeartOff size={40} />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Out of Hearts!</h2>
        <p className="text-sm text-gray-600 mb-6">
          You need hearts to keep practicing new lessons. Refill your hearts for free or return home.
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
