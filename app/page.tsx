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
    <div className="flex flex-col items-center justify-center w-full space-y-4 fade-in">
      <input
        className="glass-input w-full px-4 py-3 text-lg"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        className="glass-input w-full px-4 py-3 text-lg"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        className="glass-button w-full px-6 py-3 text-lg font-semibold text-gradient"
        onClick={() => {
          handleSubmit({ username, password });
        }}
      >
        Continue
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md w-full space-y-6 fade-in">
        <div className="text-center space-y-2">
          <h1 className={`${bungee.className} text-5xl text-gradient mb-2`}>
            Reel Riddle
          </h1>
          <p className="text-slate-300 text-lg">🎬 Daily Movie Guessing Game</p>
        </div>
        
        <div className="space-y-4">
          {!signup && (
            <button
              className="glass-button w-full px-6 py-3 text-lg font-semibold"
              onClick={() => toggleLogin((prev) => !prev)}
            >
              {login ? "Cancel" : "Log In"}
            </button>
          )}
          
          {login && <PlayerForm handleSubmit={loginHandler} />}
          
          {!login && (
            <button
              className="glass-button w-full px-6 py-3 text-lg font-semibold"
              onClick={() => toggleSignup((prev) => !prev)}
            >
              {signup ? "Cancel" : "Sign Up"}
            </button>
          )}
          
          {signup && <PlayerForm handleSubmit={signupHandler} />}
          
          {!(signup || login) && (
            <button
              className="glass-button w-full px-6 py-3 text-lg font-semibold border-gradient"
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/play?guest=true`)
              }
            >
              Continue As Guest
              <div className="text-sm text-slate-400 mt-1">Score will not be saved</div>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
