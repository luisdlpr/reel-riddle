"use client";
import React, { RefObject } from "react";

type Props = {
  spaceHints: spaceHintsInt;
};
interface spaceHintsInt {
  spaces: number;
  nonAlphas: [{ symbol: string; idx: number }];
}
interface inputArrayInt {
  symbol: boolean;
  input: string;
  ref?: RefObject<HTMLInputElement>;
}

export default function QuizInput({ spaceHints }: Props) {
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
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.correct) {
          setTitle(result.title);
          setPosterPath("https://image.tmdb.org/t/p/w500" + result.poster_path);
        } else {
          // do nothing
        }
      });
  };

  const generateInputArray = (spaceHints: spaceHintsInt): inputArrayInt[] => {
    let inputArray = [];
    for (let i = 0; i < spaceHints.spaces; i++) {
      inputArray.push({
        symbol: false,
        input: "",
        ref: React.createRef<HTMLInputElement>(),
      });
    }
    for (let hint of spaceHints.nonAlphas) {
      inputArray[hint.idx] = { symbol: true, input: hint.symbol };
    }

    return inputArray;
  };

  const handleFocus = (input: number, curIndex: number) => {
    let direction = 1;
    if (input === 8) {
      direction = -1;
    }

    if (inputArray[curIndex] && inputArray[curIndex].ref != undefined) {
      const curIndexRef = inputArray[curIndex].ref || null;
      if (
        curIndexRef &&
        curIndexRef.current &&
        curIndexRef.current.value.length === 0 &&
        direction === 1
      ) {
        return;
      }
      if (
        curIndexRef &&
        curIndexRef.current &&
        curIndexRef.current.value.length !== 0 &&
        direction === -1
      ) {
        return;
      }
    }

    let index = curIndex + direction;

    if (index >= spaceHints.spaces || index < 0) {
      return;
    }

    if (inputArray && inputArray[index] && inputArray[index].ref != undefined) {
      const inputArrayRef = inputArray[index].ref || null;
      if (inputArrayRef && inputArrayRef.current) {
        inputArrayRef.current.focus();
      }
    } else {
      handleFocus(input, index);
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
    <div className="flex flex-col items-center justify-center">
      {title !== "" ? <h1>{title}</h1> : <h1>???</h1>}
      {posterPath !== "" ? (
        <img src={posterPath} />
      ) : (
        <div
          className="bg-black text-indigo-50 text-9xl flex items-center justify-center"
          style={{ width: "390px", height: "585px" }}
        >
          ?
        </div>
      )}
      {inputArray.map((char, index) => {
        return char.symbol === true ? (
          <span> {char.input} </span>
        ) : (
          <input
            maxLength={1}
            ref={char.ref}
            onKeyDown={(e) => handleFocus(e.keyCode, index)}
          ></input>
        );
      })}
      <button onClick={submitAnswer}>submit</button>
    </div>
  );
}
