"use client";
import React from "react";

export default function QuizInput() {
  const [answer, setAnswer] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [posterPath, setPosterPath] = React.useState("");

  const handleChange = () => {
    console.log(answer);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/play`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: answer,
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
  return (
    <div>
      {title !== "" && <h1>{title}</h1>}
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
      <input onChange={(e) => setAnswer(e.target.value)}></input>
      <button onClick={handleChange}>submit</button>
    </div>
  );
}
