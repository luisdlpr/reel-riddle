"use client";

import React from "react";
import { Bungee } from "next/font/google";

const bungee = Bungee({ subsets: ["latin"], weight: "400" });
let md5 = require("md5");

function PlayerForm({
  handleSubmit,
}: {
  handleSubmit: (payload: { username: string; password: string }) => void;
}) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="flex flex-col items-center justify-center w-full text-indigo-950">
      <input
        className="m-1 w-full rounded-xl p-1"
        placeholder="username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        className="m-1 w-full rounded-xl p-1"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        className="m-1 w-full rounded-xl p-1 bg-indigo-100"
        onClick={() => {
          handleSubmit({ username, password });
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default function Home() {
  const [login, toggleLogin] = React.useState(false);
  const [signup, toggleSignup] = React.useState(false);

  const loginHandler = (payload: { username: string; password: string }) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/player` +
        `?username=${payload.username}&password=${md5(payload.password)}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.token) {
          window.localStorage.setItem("token", json.token);
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play`;
        }
      });
  };

  const signupHandler = (payload: { username: string; password: string }) => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/player`, {
      method: "POST",
      body: JSON.stringify({
        username: payload.username,
        password: md5(payload.password),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.token) {
          window.localStorage.setItem("token", json.token);
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play`;
        }
      });
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="bg-indigo-700 flex flex-col items-center justify-center text-indigo-50 p-3 rounded-xl">
        <h1 className={`${bungee.className} text-center text-5xl m-4`}>
          Reed Riddle 🎬
        </h1>
        <hr className="w-full" />
        {!signup && (
          <button
            className="p-2 m-2 w-full rounded-xl bg-indigo-100 text-indigo-950"
            onClick={() => toggleLogin((prev) => !prev)}
          >
            Log In
          </button>
        )}
        {login && <PlayerForm handleSubmit={loginHandler} />}
        {!login && (
          <button
            className="p-2 m-2 w-full rounded-xl bg-indigo-100 text-indigo-950"
            onClick={() => toggleSignup((prev) => !prev)}
          >
            Sign Up
          </button>
        )}
        {signup && <PlayerForm handleSubmit={signupHandler} />}
        {!(signup || login) && (
          <button
            className="p-2 m-2 w-full rounded-xl bg-indigo-100 text-indigo-950"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play?guest=true`)
            }
          >
            Continue As Guest (Score will not be saved)
          </button>
        )}
      </div>
    </main>
  );
}
