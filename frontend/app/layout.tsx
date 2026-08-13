import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duolingo-Style Language Learning App",
  description: "A modern, gamified language learning web application built with Next.js and FastAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen text-gray-800 antialiased selection:bg-sky-200">
        {children}
      </body>
    </html>
  );
}
