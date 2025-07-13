"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Props = {
    spaceHints: spaceHintsInt;
    penalties: number;
    applyPenalty: (amount: number) => void;
    showLeaderBoard: () => void;
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

const QuizInput = ({
    spaceHints,
    penalties,
    applyPenalty,
    showLeaderBoard,
}: Props) => {
    const [winState, setWinState] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [posterPath, setPosterPath] = React.useState("");
    const [inputArray, setInputArray] = React.useState<inputArrayInt[]>([]);
    const containerDiv = React.useRef<HTMLDivElement>(null);
    const submitButton = React.useRef<HTMLButtonElement>(null);
    const searchParams = useSearchParams();

    const setWin = React.useCallback((setLocal: boolean, title?: string, posterPath?: string) => {
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
            containerDiv.current.classList.add("bg-green-500/20");
            containerDiv.current.classList.remove("glass-card");
        }
        if (submitButton.current) {
            submitButton.current.classList.add("bg-green-500");
            submitButton.current.classList.add("disabled");
            submitButton.current.classList.remove("glass-button");
            submitButton.current.innerText = "Correct ✅";
            submitButton.current.onclick = null;
        }
        setWinState(true);
        showLeaderBoard();
    }, [showLeaderBoard, setWinState]);

    React.useEffect(() => {
        setInputArray(generateInputArray(spaceHints));

        if (
            !(searchParams && searchParams.get("guest")) &&
            window.localStorage.getItem("token")
        ) {
            fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/player/check_win` +
                `?token=${window.localStorage.getItem("token")}&date=${new Date(
                    Date.now(),
                ).toDateString()}`,
                {
                    method: "GET",
                },
            )
                .then((res) => res.json())
                .then((json) => {
                    if (json.answer !== "none") {
                        setWin(false);
                        setWinState(true);
                        setTitle(json.answer.title);
                        setPosterPath(
                            "https://image.tmdb.org/t/p/w500" + json.answer.poster_path,
                        );
                    }
                });
        }

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
    }, [searchParams, spaceHints, setWin]);

    React.useEffect(() => {
        let localAttempts = window.localStorage.getItem(
            new Date(Date.now()).toDateString(),
        );

        if (localAttempts) {
            console.log("applying penalty");
            applyPenalty(parseInt(localAttempts));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const showIncorrect = () => {
        if (submitButton.current) {
            submitButton.current.classList.add("bg-red-500");
            submitButton.current.classList.remove("glass-button");
            submitButton.current.innerText = "Incorrect ❌";

            setTimeout(() => {
                if (submitButton.current) {
                    submitButton.current.classList.add("glass-button");
                    submitButton.current.classList.remove("bg-red-500");
                    submitButton.current.innerText = "Submit Answer";
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
            let payload: { title: string; score: number; token?: string } = {
                title: getAnswer(),
                score: Math.max(0, 10 - penalties),
            };

            if (window.localStorage.getItem("token")) {
                payload.token = window.localStorage.getItem("token") || undefined;
            }

            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
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
            if (hint.symbol === ' ' || hint.symbol === '-') {
                // Mark spaces and dashes as gaps (no input field)
                inputArray[hint.idx] = { symbol: false, input: hint.symbol };
            } else {
                // Other symbols get prefilled
                inputArray[hint.idx] = { symbol: true, input: hint.symbol };
            }
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
                return ref.current.value.toLowerCase(); // Convert to lowercase
            } else {
                return inputElement.input.toLowerCase(); // Convert to lowercase
            }
        };
        return inputArray.map(getValueFromRef).join("");
    };

    return (
        <div
            ref={containerDiv}
            className="glass-card p-6 space-y-6"
        >
            {/* Title Display */}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">
                    {title !== "" ? title : "???"}
                </h1>
            </div>

            {/* Poster Display */}
            {posterPath !== "" ? (
                <div className="flex justify-center">
                    <Image
                        src={posterPath}
                        alt="correct answer poster"
                        className="rounded-lg shadow-2xl object-cover"
                        width={305}
                        height={500}
                        priority={false}
                        unoptimized={true}
                    />
                </div>
            ) : (
                <div className="flex justify-center">
                    <div
                        className="glass flex items-center justify-center rounded-lg shadow-2xl text-9xl"
                        style={{ width: "305px", height: "500px" }}
                    >
                        ?
                    </div>
                </div>
            )}

            {/* Input Grid */}
            <div className="flex items-center justify-center flex-wrap gap-1 mb-4">
                <div className="w-full text-center mb-2">
                    <p className="text-slate-400 text-sm">Fill in the movie title</p>
                </div>
                {inputArray.map((char, index) => {
                    // Handle spaces as gaps (no input field)
                    if (char.input === ' ' || char.input === '-') {
                        return (
                            <div 
                                key={index}
                                className="w-12 h-12 flex items-center justify-center"
                            >
                                <div className="w-6 h-0.5 bg-slate-500 rounded-full opacity-60"></div>
                            </div>
                        );
                    }
                    
                    return char.symbol === true ? (
                        <span 
                            key={index}
                            className="glass px-3 py-2 text-lg font-semibold rounded-lg min-w-[3rem] text-center"
                        >
                            {char.input}
                        </span>
                    ) : (
                        <input
                            className="glass-input w-12 h-12 text-center text-lg font-semibold uppercase"
                            maxLength={1}
                            ref={char.ref}
                            key={index}
                            onKeyDown={(e) => handleFocus(e.keyCode, index)}
                            onInput={(e) => {
                                // Convert to uppercase for display, but store as lowercase
                                const target = e.target as HTMLInputElement;
                                const value = target.value.toUpperCase();
                                target.value = value;
                                
                                // Auto-advance to next input if character entered
                                if (value && index < inputArray.length - 1) {
                                    setTimeout(() => {
                                        // Find next input field (skip gaps and symbols)
                                        let nextIndex = index + 1;
                                        while (nextIndex < inputArray.length) {
                                            const nextChar = inputArray[nextIndex];
                                            if (!nextChar.symbol && nextChar.input !== ' ' && nextChar.input !== '-') {
                                                const nextInput = nextChar.ref?.current;
                                                if (nextInput) {
                                                    nextInput.focus();
                                                    break;
                                                }
                                            }
                                            nextIndex++;
                                        }
                                    }, 10);
                                }
                            }}
                            placeholder=""
                        />
                    );
                })}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    className="glass-button px-8 py-3 text-lg font-semibold"
                    onClick={submitAnswer}
                    ref={submitButton}
                >
                    Submit Answer
                </button>
            </div>
        </div>
    );
};

export default QuizInput;
