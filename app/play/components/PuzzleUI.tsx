"use client";

import React from "react";
import QuizInput from "./QuizInput";
import Puzzle from "../../PuzzleClass";
import QuizHint from "./QuizHint";
import LeaderBoard from "./LeaderBoard";
import { useSearchParams } from "next/navigation";

export default function PuzzleUI({ puzzleJSON }: { puzzleJSON: {} }) {
  const puzzleData = new Puzzle(puzzleJSON);
  const [penalties, setPenalties] = React.useState<number>(0);
  const [leaderboard, toggleLeaderBoard] = React.useState<boolean>(false);
  const pointsIndicator = React.useRef<HTMLHeadingElement>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (
      !(searchParams && searchParams.get("guest")) &&
      window.localStorage.getItem("token") == null
    ) {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play?guest=true`;
    }
  }, [searchParams]);

  const showLeaderBoard = () => {
    toggleLeaderBoard(true);
  };

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
    <div className="flex sm:flex-row flex-col items-center justify-center bg-indigo-200 rounded-lg m-2 p-2 shadow-inner">
      <QuizInput
        spaceHints={puzzleData.space_hints}
        penalties={penalties}
        applyPenalty={applyPenalty}
        showLeaderBoard={showLeaderBoard}
      />
      <div className="w-11/12 flex flex-col items-center justify-center">
        {leaderboard ? (
          <LeaderBoard />
        ) : (
          <div>
            <h1
              ref={pointsIndicator}
              className="text-3xl m-3 p-3 bg-indigo-700 rounded-xl text-indigo-50 inner-shadow"
            >
              Points {Math.max(0, 10 - penalties)}
            </h1>
            <div className="max-w-xl p-3 m-3 bg-indigo-700 text-indigo-50 rounded-xl inner-shadow">
              <h1 className="text-xl">
                {puzzleData.release_date.getFullYear()}
              </h1>
              <h2 className="max-w-xl">{puzzleData.tagline}</h2>
              <hr />
              <p className="m-4 w-fit">
                <i>{`'${puzzleData.plot}'`}</i>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 m-4 flex-wrap max-w-xl">
              {puzzleData.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-indigo-700 text-indigo-50 p-1.5 rounded-full inner-shadow"
                >
                  {genre}
                </span>
              ))}
            </div>
            <QuizHint
              info={puzzleData.cast}
              applyPenalty={applyPenalty}
              name="casting"
              cost={2}
            />
            <QuizHint
              info={puzzleData.producers}
              applyPenalty={applyPenalty}
              name="producers"
              cost={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}
