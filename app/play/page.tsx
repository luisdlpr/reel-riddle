"use client";

import React from "react";
import PuzzleUI from "./components/PuzzleUI";
import Login from "./components/Login";
import { Bungee } from "next/font/google";

const bungee = Bungee({ subsets: ["latin"], weight: "400" });

// const getPuzzle = async () => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
//     method: "GET",
//     cache: "no-store",
//   });
//
//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }
//
//   const puzzleJSON = await res.json();
//
//   return { puzzleJSON };
// };

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
    <main className="text-center flex flex-col items-center">
      <div className="max-w-xl flex flex-wrap items-center justify-center">
        <h1 className={`${bungee.className} text-4xl m-4`}>Reed Riddle 🎬</h1>
        <Login />
      </div>
      {puzzle != undefined && <PuzzleUI puzzleJSON={puzzle} />}
    </main>
  );
}
