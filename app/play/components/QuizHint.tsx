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

  React.useEffect(() => {
    if (
      window.localStorage.getItem(name) === new Date(Date.now()).toDateString()
    ) {
      applyPenalty(cost);
      toggleShow(true);
    }
  }, [applyPenalty, cost, name]);

  return (
    <div className="glass-card p-6">
      {show ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center capitalize">
            {name} Information
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {info
              .filter((element) => element.img_path)
              .slice(0, 3)
              .map((element) => {
                return <HintCard key={element.name} hintInfo={element} />;
              })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            className="glass-button px-6 py-3 text-lg font-semibold"
            onClick={() => {
              applyPenalty(cost);
              toggleShow(true);
              window.localStorage.setItem(
                name,
                new Date(Date.now()).toDateString(),
              );
            }}
          >
            Reveal {name} info
            <div className="text-sm text-slate-400 mt-1">
              Cost: {cost} points
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
