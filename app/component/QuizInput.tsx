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
  const [title, setTitle] = React.useState("");
  const [posterPath, setPosterPath] = React.useState("");
  const [inputArray, setInputArray] = React.useState<inputArrayInt[]>([]);

  React.useEffect(() => {
    setInputArray(generateInputArray(spaceHints));
  }, []);

  const submitAnswer = () => {
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
          setTitle(result.title);
          setPosterPath("https://image.tmdb.org/t/p/w500" + result.poster_path);
        } else {
          applyPenalty(1);
        }
      });
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
        } else {
          return true;
        }
      }
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
    <div className="flex flex-col gap-3 items-center justify-center bg-indigo-200 rounded-lg m-2 shadow-inner">
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
      >
        Lock In
      </button>
    </div>
  );
};

export default QuizInput;
