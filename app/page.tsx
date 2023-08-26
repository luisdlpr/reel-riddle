import React from "react";
import QuizInput from "./component/guessInput";

class Puzzle {
  id: string;
  tmdb_id: string;
  tagline: string;
  plot: string;
  genres: [string];
  producers: { name: string; img_path: string }[];
  cast: { name: string; img_path: string }[];
  release_date: Date;
  played: Date;
  space_hints: { spaces: number; blanks: [number] };

  constructor(puzzleJSON: { [key: string]: any }) {
    this.id = puzzleJSON.id;
    this.tmdb_id = puzzleJSON.tmdb_id;
    this.tagline = puzzleJSON.tagline;
    this.plot = puzzleJSON.plot;
    this.genres = puzzleJSON.genres.split(", ");
    this.producers = this.parseDetailsString(puzzleJSON.producers);
    this.cast = this.parseDetailsString(puzzleJSON.cast);
    this.release_date = new Date(puzzleJSON.release_date);
    this.played = new Date(puzzleJSON.played);
    this.space_hints = puzzleJSON.space_hints;
  }

  parseDetailsString(details: string) {
    const detailsArray = details.split(", ");
    return detailsArray.map((detail) => {
      let splitDetail = detail.split("(");
      return { name: splitDetail[0], img_path: splitDetail[1].slice(0, -1) };
    });
  }
}

async function getPuzzle() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const puzzleData = await res.json();

  return puzzleData;
}

// function guessInput(space_hints: {spaces:number; blanks: [number]}) {

//   return (<input></input>)
// }

export default async function Home() {
  const puzzleData = new Puzzle(await getPuzzle());

  return (
    <main className="text-center">
      <h1 className="text-5xl m-4">Reed Riddle 🎬</h1>
      <h1 className="text-xl">{puzzleData.release_date.getFullYear()}</h1>
      <h2>{puzzleData.tagline}</h2>
      <p className="m-4">
        <i>'{puzzleData.plot}'</i>
      </p>
      <div className="flex justify-center gap-2 m-4 flex-wrap">
        {puzzleData.genres.map((genre) => (
          <span className="bg-indigo-700 text-indigo-50 p-1 rounded-full">
            {genre}
          </span>
        ))}
      </div>
      <QuizInput />
    </main>
  );
}
