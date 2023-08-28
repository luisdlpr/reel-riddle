"use client";

import React from "react";
import CastCard from "./CastCard";
import QuizInput from "./guessInput";
import Puzzle from "../PuzzleClass";
import ProdCard from "./ProdCard";

export default function PuzzleUI({ puzzleJSON }: { puzzleJSON: {} }) {
  const puzzleData = new Puzzle(puzzleJSON);
  const [showCast, toggleShowCast] = React.useState<boolean>(false);
  const [showProd, toggleShowProd] = React.useState<boolean>(false);
  const [penalties, setPenalties] = React.useState<number>(0);

  return (
    <div>
      <h1 className="text-xl">{puzzleData.release_date.getFullYear()}</h1>
      <h2>{puzzleData.tagline}</h2>
      <h2>Penalties {penalties}</h2>
      <QuizInput
        spaceHints={puzzleData.space_hints}
        penalties={penalties}
        setPenalties={setPenalties}
      />
      <p className="m-4">
        <i>'{puzzleData.plot}'</i>
      </p>
      <div className="flex justify-center gap-2 m-4 flex-wrap">
        {puzzleData.genres.map((genre) => (
          <span
            key={genre}
            className="bg-indigo-700 text-indigo-50 p-1 rounded-full"
          >
            {genre}
          </span>
        ))}
      </div>
      {showCast ? (
        <div className="flex flex-wrap align-center justify-center">
          {puzzleData.cast.map((actor) => {
            return (
              <CastCard
                key={actor.name}
                castMember={actor}
              />
            );
          })}
        </div>
      ) : (
        <div>
          <button
            className="m-2 p-2 rounded-xl bg-indigo-700 text-indigo-50"
            onClick={() => {
              setPenalties((prev) => prev + 2);
              toggleShowCast(true);
            }}
          >
            Click to show casting info (cost 2 points)
          </button>
        </div>
      )}
      {showProd ? (
        <div className="flex flex-wrap align-center justify-center">
          {puzzleData.producers.map((producer) => {
            return (
              <ProdCard
                key={producer.name}
                prodCompany={producer}
              />
            );
          })}
        </div>
      ) : (
        <div>
          <button
            className="m-2 p-2 rounded-xl bg-indigo-700 text-indigo-50"
            onClick={() => {
              setPenalties((prev) => prev + 2);
              toggleShowProd(true);
            }}
          >
            Click to show producer info (cost 2 points)
          </button>
        </div>
      )}
    </div>
  );
}
