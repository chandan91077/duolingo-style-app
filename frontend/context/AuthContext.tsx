"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { syncUser, getLearner, refillHearts as apiRefillHearts } from "@/lib/api";
import { Learner } from "@/lib/types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: Learner | null;
  loading: boolean;
  loginWithGoogle: () => Promise<Learner>;
  loginWithEmail: (e: string, p: string) => Promise<Learner>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<Learner>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refillHearts: () => Promise<Learner>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  dbUser: null,
  loading: true,
  loginWithGoogle: async () => { throw new Error("Uninitialized"); },
  loginWithEmail: async () => { throw new Error("Uninitialized"); },
  signUpWithEmail: async () => { throw new Error("Uninitialized"); },
  logout: async () => {},
  refreshUser: async () => {},
  refillHearts: async () => { throw new Error("Uninitialized"); },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);

  const createOrSyncLocalUser = async (email: string, name?: string): Promise<Learner> => {
    const fakeUid = "local_" + btoa(email).replace(/=/g, "");
    const synced = await syncUser({
      uid: fakeUid,
      email: email,
      displayName: name || email.split("@")[0],
      photoURL: "🚀",
    });
    setFirebaseUser({
      uid: fakeUid,
      email: email,
      displayName: synced.name,
      photoURL: synced.avatar,
    } as any);
    setDbUser(synced);
    if (typeof window !== "undefined") {
      localStorage.setItem("duo-local-user", JSON.stringify({ uid: fakeUid, email, name: synced.name }));
    }
    return synced;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        try {
          const synced = await syncUser(user);
          setDbUser(synced);
        } catch (err) {
          console.error("Failed to sync backend user:", err);
          try {
            const fallback = await getLearner();
            setDbUser(fallback);
          } catch {
            setDbUser(null);
          }
        }
      } else {
        const savedLocal = typeof window !== "undefined" ? localStorage.getItem("duo-local-user") : null;
        if (savedLocal) {
          try {
            const parsed = JSON.parse(savedLocal);
            const synced = await syncUser({
              uid: parsed.uid,
              email: parsed.email,
              displayName: parsed.name,
              photoURL: "🚀",
            });
            setFirebaseUser({
              uid: parsed.uid,
              email: parsed.email,
              displayName: synced.name,
            } as any);
            setDbUser(synced);
          } catch {
            if (typeof window !== "undefined") localStorage.removeItem("duo-user-id");
            setDbUser(null);
            setFirebaseUser(null);
          }
        } else {
          if (typeof window !== "undefined") localStorage.removeItem("duo-user-id");
          setDbUser(null);
          setFirebaseUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<Learner> => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const synced = await syncUser(res.user);
      setDbUser(synced);
      return synced;
    } catch (err: any) {
      if (
        err.code === "auth/configuration-not-found" ||
        err.code === "auth/operation-not-allowed" ||
        err.message?.includes("configuration-not-found")
      ) {
        throw new Error(
          "Google Sign-In is not enabled in Firebase Console. Please enable 'Google' under Authentication -> Sign-in method in your Firebase Console."
        );
      }
      if (err.code === "auth/popup-closed-by-user") {
        throw new Error("Google Sign-In popup was closed before completing.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (e: string, p: string): Promise<Learner> => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, e, p);
      const synced = await syncUser(res.user);
      setDbUser(synced);
      return synced;
    } catch (err: any) {
      if (
        err.code === "auth/configuration-not-found" ||
        err.code === "auth/operation-not-allowed" ||
        err.message?.includes("configuration-not-found")
      ) {
        throw new Error(
          "Email/Password Sign-In is not enabled in Firebase Console. Please enable 'Email/Password' under Authentication -> Sign-in method in your Firebase Console."
        );
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (e: string, p: string, name: string): Promise<Learner> => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, e, p);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      const synced = await syncUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name || res.user.displayName,
        photoURL: res.user.photoURL,
      });
      setDbUser(synced);
      return synced;
    } catch (err: any) {
      if (
        err.code === "auth/configuration-not-found" ||
        err.code === "auth/operation-not-allowed" ||
        err.message?.includes("configuration-not-found")
      ) {
        throw new Error(
          "Email/Password Sign-In is not enabled in Firebase Console. Please enable 'Email/Password' under Authentication -> Sign-in method in your Firebase Console."
        );
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        await signOut(auth);
      } catch {
        // ignore signout error if auth unconfigured
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("duo-user-id");
        localStorage.removeItem("duo-local-user");
      }
      setDbUser(null);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const synced = await syncUser(firebaseUser);
      setDbUser(synced);
    } else {
      const fetched = await getLearner();
      setDbUser(fetched);
    }
  };

  const refillHearts = async (): Promise<Learner> => {
    const updated = await apiRefillHearts();
    setDbUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        refreshUser,
        refillHearts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
