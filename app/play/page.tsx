"use client";

import React from "react";
import PuzzleUI from "./components/PuzzleUI";
import Login from "./components/Login";
import { Bungee } from "next/font/google";

const bungee = Bungee({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [puzzle, setPuzzle] = React.useState<{}>();

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((json) => {
        setPuzzle(json);
      });
  }, []);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6 text-center fade-in">
          <h1 className={`${bungee.className} text-4xl text-gradient mb-2`}>
            Reel Riddle 🎬
          </h1>
          <p className="text-slate-300">Daily Movie Guessing Challenge</p>
          <div className="mt-4">
            <Login />
          </div>
        </div>
        
        {/* Game Content */}
        {puzzle != undefined && (
          <div className="slide-in">
            <PuzzleUI puzzleJSON={puzzle} />
          </div>
        )}
        
        {/* Loading State */}
        {puzzle === undefined && (
          <div className="glass-card p-12 text-center">
            <div className="pulse text-2xl mb-4">🎬</div>
            <p className="text-slate-300">Loading today's puzzle...</p>
          </div>
        )}
      </div>
    </main>
  );
}
