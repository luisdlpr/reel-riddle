import React from "react";
import PuzzleUI from "./component/PuzzleUI";

const getPuzzle = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const puzzleJSON = await res.json();

  return { puzzleJSON };
};

export default async function Home() {
  const { puzzleJSON } = await getPuzzle();

  return (
    <main className="text-center flex flex-col items-center">
      <h1 className="text-5xl m-4">Reed Riddle 🎬</h1>
      <PuzzleUI puzzleJSON={puzzleJSON} />
    </main>
  );
}
