"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, LogIn, UserPlus, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  onSuccess,
}) => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }
        await signUpWithEmail(email, password, name.trim());
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "") || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop backdrop-blur-xs">
      <div
        className="rounded-3xl p-6 sm:p-8 max-w-md w-full relative border-4 shadow-2xl transition-colors"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition"
          style={{ color: "var(--muted-foreground)" }}
        >
          <X size={20} />
        </button>

        {/* Custom Header if title/subtitle provided */}
        {(title || subtitle) && (
          <div className="text-center mb-5 pr-6">
            {title && (
              <h3 className="text-lg font-extrabold" style={{ color: "var(--foreground)" }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs font-bold mt-1" style={{ color: "var(--muted-foreground)" }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Header Tabs */}
        <div className="flex border-b mb-6" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 py-3 font-extrabold text-sm border-b-2 transition ${
              mode === "login"
                ? "border-sky-500 text-sky-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            LOG IN
          </button>
          <button
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 py-3 font-extrabold text-sm border-b-2 transition ${
              mode === "signup"
                ? "border-sky-500 text-sky-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Auth Button */}
        <button
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm border-2 border-b-4 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 flex items-center justify-center gap-3 transition cursor-pointer mb-5 shadow-xs disabled:opacity-50"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
          <span className="px-3 text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
            OR
          </span>
          <div className="flex-grow border-t" style={{ borderColor: "var(--border)" }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-extrabold uppercase mb-1" style={{ color: "var(--muted-foreground)" }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="theme-input w-full p-3 rounded-xl text-sm font-bold"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold uppercase mb-1" style={{ color: "var(--muted-foreground)" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="learner@example.com"
              className="theme-input w-full p-3 rounded-xl text-sm font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase mb-1" style={{ color: "var(--muted-foreground)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="theme-input w-full p-3 rounded-xl text-sm font-bold"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-duo-green w-full py-3.5 rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {mode === "login" ? (
              <>
                <LogIn size={18} /> {submitting ? "LOGGING IN..." : "LOG IN"}
              </>
            ) : (
              <>
                <UserPlus size={18} /> {submitting ? "CREATING..." : "CREATE ACCOUNT"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
