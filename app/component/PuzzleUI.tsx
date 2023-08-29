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
  const pointsIndicator = React.useRef<HTMLHeadingElement>(null);

  const applyPenalty = (amount: number) => {
    pointsIndicator.current?.classList.add("bg-red-700");
    pointsIndicator.current?.classList.add("animate-ping");
    setTimeout(() => {
      setPenalties((prev) => prev + amount);
      pointsIndicator.current?.classList.remove("bg-red-700");
      pointsIndicator.current?.classList.remove("animate-ping");
    }, 1000);
  };

  return (
    <div className="flex sm:flex-row flex-col items-center justify-center">
      <QuizInput
        spaceHints={puzzleData.space_hints}
        penalties={penalties}
        setPenalties={setPenalties}
      />
      <div className="w-11/12 flex flex-col items-center justify-center">
        <h1
          ref={pointsIndicator}
          className="text-3xl mb-3 p-3 bg-indigo-700 rounded-xl text-indigo-50 inner-shadow"
        >
          Points {Math.max(0, 10 - penalties)}
        </h1>
        <div className="p-3 m-3 bg-indigo-700 text-indigo-50 rounded-xl inner-shadow">
          <h1 className="text-xl">{puzzleData.release_date.getFullYear()}</h1>
          <h2 className="max-w-xl">{puzzleData.tagline}</h2>
          <hr />
          <p className="m-4 max-w-sm">
            <i>'{puzzleData.plot}'</i>
          </p>
        </div>
        <div className="flex justify-center gap-2 m-4 flex-wrap max-w-sm">
          {puzzleData.genres.map((genre) => (
            <span
              key={genre}
              className="bg-indigo-700 text-indigo-50 p-1.5 rounded-full inner-shadow"
            >
              {genre}
            </span>
          ))}
        </div>
        {showCast ? (
          <div className="flex flex-wrap align-center justify-center max-w-sm">
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
              className="m-2 p-2 rounded-xl border-2 border-solid border-indigo-950 bg-indigo-400 text-indigo-50"
              onClick={() => {
                applyPenalty(2);
                toggleShowCast(true);
              }}
            >
              Click to show casting info (cost 2 points)
            </button>
          </div>
        )}
        {showProd ? (
          <div className="flex flex-wrap align-center justify-center max-w-sm">
            {puzzleData.producers
              .filter((producer) => producer.img_path)
              .slice(0, 3)
              .map((producer) => {
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
              className="m-2 p-2 rounded-xl border-2 border-solid border-indigo-950 bg-indigo-400 text-indigo-50"
              onClick={() => {
                applyPenalty(2);
                toggleShowProd(true);
              }}
            >
              Click to show producer info (cost 2 points)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
