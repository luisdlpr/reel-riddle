"use client";
import React from "react";

type Props = {
  spaceHints: spaceHintsInt;
  penalties: number;
  applyPenalty: (amount: number) => void;
};

interface spaceHintsInt {
  spaces: number;
  nonAlphas: [{ symbol: string; idx: number }];
}

interface inputArrayInt {
  symbol: boolean;
  input: string;
  ref?: React.RefObject<HTMLInputElement>;
}

const QuizInput = ({ spaceHints, penalties, applyPenalty }: Props) => {
  const [winState, setWinState] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [posterPath, setPosterPath] = React.useState("");
  const [inputArray, setInputArray] = React.useState<inputArrayInt[]>([]);
  const containerDiv = React.useRef<HTMLDivElement>(null);
  const submitButton = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setInputArray(generateInputArray(spaceHints));

    let lastWin = window.localStorage.getItem("won");
    let lastWinJSON;
    if (lastWin) {
      lastWinJSON = JSON.parse(lastWin);
    }

    if (
      lastWinJSON &&
      lastWinJSON.date === new Date(Date.now()).toDateString()
    ) {
      setWin(false);
      setWinState(true);
      setTitle(lastWinJSON.title);
      setPosterPath(lastWinJSON.posterPath);
    }

    let localAttempts = window.localStorage.getItem(
      new Date(Date.now()).toDateString(),
    );

    if (localAttempts) {
      applyPenalty(parseInt(localAttempts));
    }
  }, []);

  const setWin = (setLocal: boolean, title?: string, posterPath?: string) => {
    if (setLocal && title && posterPath) {
      window.localStorage.setItem(
        "won",
        JSON.stringify({
          date: new Date(Date.now()).toDateString(),
          title,
          posterPath,
        }),
      );
    }
    if (containerDiv.current) {
      containerDiv.current.classList.add("bg-green-200");
      containerDiv.current.classList.remove("bg-indigo-200");
    }
    if (submitButton.current) {
      submitButton.current.classList.add("bg-green-400");
      submitButton.current.classList.add("disabled");
      submitButton.current.classList.remove("bg-indigo-400");
      submitButton.current.innerText = "Correct ✅";
      submitButton.current.onclick = null;
    }
    setWinState(true);
  };

  const showIncorrect = () => {
    if (submitButton.current) {
      submitButton.current.classList.add("bg-red-400");
      submitButton.current.classList.remove("bg-indigo-400");
      submitButton.current.innerText = "Incorrect ❌";

      setTimeout(() => {
        if (submitButton.current) {
          submitButton.current.classList.add("bg-indigo-400");
          submitButton.current.classList.remove("bg-red-400");
          submitButton.current.innerText = "Lock In";
        }
      }, 1000);
    }
  };

  const incrementAttempts = () => {
    const localAttempts = window.localStorage.getItem(
      new Date(Date.now()).toDateString(),
    );

    if (localAttempts) {
      window.localStorage.setItem(
        new Date(Date.now()).toDateString(),
        (parseInt(localAttempts) + 1).toString(),
      );
    } else {
      window.localStorage.setItem(
        new Date(Date.now()).toDateString(),
        (1).toString(),
      );
    }
  };

  const submitAnswer = () => {
    if (!winState) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: getAnswer(),
          score: Math.max(0, 10 - penalties),
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.correct) {
            const fullPosterPath =
              "https://image.tmdb.org/t/p/w500" + result.poster_path;
            setTitle(result.title);
            setPosterPath(fullPosterPath);
            setWin(true, result.title, fullPosterPath);
          } else {
            showIncorrect();
            applyPenalty(1);
            incrementAttempts();
          }
        });
    }
  };

  const generateInputArray = (spaceHints: spaceHintsInt): inputArrayInt[] => {
    let inputArray = [];

    // fill array of length spaceHints.spaces with default inputtable
    for (let i = 0; i < spaceHints.spaces; i++) {
      inputArray.push({
        symbol: false,
        input: "",
        ref: React.createRef<HTMLInputElement>(),
      });
    }

    // for any nonAlpha characters, replace with a prefilled
    for (let hint of spaceHints.nonAlphas) {
      inputArray[hint.idx] = { symbol: true, input: hint.symbol };
    }

    return inputArray;
  };

  const handleFocus = (input: number, curIndex: number) => {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    const BACKSPACE = 8;
    const FORWARD = 1;
    const BACKWARD = -1;
    const shouldMoveFocus = (direction: number, idx: number) => {
      if (inputArray[idx] && inputArray[idx].ref != undefined) {
        const curIndexRef = inputArray[idx].ref || null;
        if (
          curIndexRef &&
          curIndexRef.current &&
          curIndexRef.current.value.length === 0 &&
          direction === FORWARD
        ) {
          return false;
        } else if (
          curIndexRef &&
          curIndexRef.current &&
          curIndexRef.current.value.length !== 0 &&
          direction === BACKWARD
        ) {
          return false;
        }
      }
      return true;
    };
    const inBounds = (index: number) => {
      return !(index >= spaceHints.spaces || index < 0);
    };

    let direction = FORWARD;
    if (input === BACKSPACE) {
      direction = BACKWARD;
    } else if (input === LEFT_ARROW || input === RIGHT_ARROW) {
      return; // ignore left or right arrow input
    }
    let index = curIndex + direction;

    if (shouldMoveFocus(direction, curIndex) && inBounds(index)) {
      if (
        inputArray &&
        inputArray[index] &&
        inputArray[index].ref != undefined
      ) {
        const inputArrayRef = inputArray[index].ref || null;
        if (inputArrayRef && inputArrayRef.current) {
          inputArrayRef.current.focus();
        }
      } else {
        handleFocus(input, index);
      }
    }
  };

  const getAnswer = () => {
    const getValueFromRef = (inputElement: inputArrayInt) => {
      const ref = inputElement.ref || null;
      if (ref && ref.current) {
        return ref.current.value;
      } else {
        return inputElement.input;
      }
    };
    return inputArray.map(getValueFromRef).join("");
  };

  return (
    <div
      ref={containerDiv}
      className="flex flex-col gap-3 items-center justify-center bg-indigo-200 rounded-lg m-2 shadow-inner"
    >
      <h1 className="text-xl m-3">{title !== "" ? title : "???"}</h1>
      {posterPath !== "" ? (
        <img
          src={posterPath}
          className="rounded-lg drop-shadow"
          style={{ width: "305px", height: "500px" }}
        />
      ) : (
        <div
          className="bg-black text-indigo-50 text-9xl flex items-center justify-center rounded-lg drop-shadow"
          style={{ width: "305px", height: "500px" }}
        >
          ?
        </div>
      )}
      <div className="w-4/5 flex items-center justify-center flex-wrap">
        {inputArray.map((char, index) => {
          return char.symbol === true ? (
            <span
              className="w-4 h-4"
              key={index}
            >
              {" "}
              {char.input}{" "}
            </span>
          ) : (
            <input
              className="w-6 h-6 m-1 p-1 rounded drop-shadow"
              maxLength={1}
              ref={char.ref}
              key={index}
              onKeyDown={(e) => handleFocus(e.keyCode, index)}
            ></input>
          );
        })}
      </div>
      <button
        className="w-4/5 m-3 p-2 rounded-xl border-2 border-solid border-indigo-950 bg-indigo-400 text-indigo-50"
        onClick={submitAnswer}
        ref={submitButton}
      >
        Lock In
      </button>
    </div>
  );
};

export default QuizInput;
