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
  const [rightColumnHeight, setRightColumnHeight] = React.useState<number | null>(null);
  const [isLargeScreen, setIsLargeScreen] = React.useState<boolean>(false);
  const pointsIndicator = React.useRef<HTMLHeadingElement>(null);
  const quizInputRef = React.useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (
      !(searchParams && searchParams.get("guest")) &&
      window.localStorage.getItem("token") == null
    ) {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play?guest=true`;
    }
  }, [searchParams]);

  const showLeaderBoard = React.useCallback(() => {
    toggleLeaderBoard(true);
  }, [toggleLeaderBoard]);

  const applyPenalty = React.useCallback((amount: number) => {
    pointsIndicator.current?.classList.add("bg-red-500");
    pointsIndicator.current?.classList.add("animate-ping");
    setTimeout(() => {
      setPenalties((prev) => prev + amount);
      pointsIndicator.current?.classList.remove("bg-red-500");
      pointsIndicator.current?.classList.remove("animate-ping");
    }, 1000);
  }, [setPenalties]);

  // Check screen size and measure quiz input panel height for large screens
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint is 1024px
    };

    const updateHeight = () => {
      if (quizInputRef.current && isLargeScreen) {
        const height = quizInputRef.current.offsetHeight;
        setRightColumnHeight(height);
      } else {
        setRightColumnHeight(null);
      }
    };

    // Initial check and measurement
    checkScreenSize();
    updateHeight();

    // Update on window resize
    const handleResize = () => {
      checkScreenSize();
      updateHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [puzzleData, penalties, leaderboard, isLargeScreen]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left Column - Quiz Input */}
      <div ref={quizInputRef} className="glass-card p-6 h-fit">
        <QuizInput
          spaceHints={puzzleData.space_hints}
          penalties={penalties}
          applyPenalty={applyPenalty}
          showLeaderBoard={showLeaderBoard}
        />
      </div>

      {/* Right Column - Game Info */}
      <div 
        className="space-y-6 overflow-y-auto game-info-scrollbar pr-2"
        style={{ 
          maxHeight: isLargeScreen && rightColumnHeight ? `${rightColumnHeight}px` : 'none'
        }}
      >
        {leaderboard ? (
          <div className="glass-card p-6">
            <LeaderBoard />
          </div>
        ) : (
          <>
            {/* Points Display */}
            <div className="glass-card p-6 text-center">
              <h1
                ref={pointsIndicator}
                className="text-4xl font-bold text-gradient mb-2"
              >
                {Math.max(0, 10 - penalties)} Points
              </h1>
              <p className="text-slate-400">Remaining</p>
            </div>

            {/* Movie Info */}
            <div className="glass-card p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-1">
                  {puzzleData.release_date.getFullYear()}
                </h2>
                <p className="text-slate-300 italic text-lg">
                  &ldquo;{puzzleData.tagline}&rdquo;
                </p>
              </div>
              
              <div className="border-t border-slate-600 pt-4">
                <p className="text-slate-300 leading-relaxed">
                  <span className="text-slate-400 italic">Plot:</span> {puzzleData.plot}
                </p>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 pt-2">
                {puzzleData.genres.map((genre) => (
                  <span
                    key={genre}
                    className="glass px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-4">
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
          </>
        )}
      </div>
    </div>
  );
}
