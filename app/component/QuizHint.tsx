import React from "react";
import HintCard from "./HintCard";

export default function QuizHint({
  info,
  applyPenalty,
  name,
  cost,
}: {
  info: { name: string; img_path: string }[];
  applyPenalty: (amount: number) => void;
  name: string;
  cost: number;
}) {
  const [show, toggleShow] = React.useState(false);

  return (
    <section>
      {show ? (
        <div className="flex flex-wrap align-center justify-center max-w-sm">
          {info
            .filter((element) => element.img_path)
            .slice(0, 3)
            .map((element) => {
              return (
                <HintCard
                  key={element.name}
                  hintInfo={element}
                />
              );
            })}
        </div>
      ) : (
        <div>
          <button
            className="m-2 p-2 rounded-xl border-2 border-solid border-indigo-950 bg-indigo-400 text-indigo-50"
            onClick={() => {
              applyPenalty(cost);
              toggleShow(true);
            }}
          >
            Click to show {name} info (cost {cost} points)
          </button>
        </div>
      )}
    </section>
  );
}
