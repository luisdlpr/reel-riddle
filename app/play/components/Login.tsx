"use client";

import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();

  return (
    <div>
      <button
        onClick={() => {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("won");
          window.location.href = "/";
        }}
        className="p-2 m-2 bg-indigo-200 rounded-xl"
      >
        {searchParams && searchParams.get("guest")
          ? "Sign Up or Log In"
          : "Log Out"}
      </button>
    </div>
  );
}
