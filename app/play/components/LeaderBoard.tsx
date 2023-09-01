import React from "react";

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = React.useState();
  const [player, setPlayer] = React.useState();

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => setLeaderboard(json));

    let token = window.localStorage.getItem("token");

    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard?player=${token}`,
        {
          method: "GET",
          cache: "no-store",
        },
      )
        .then((res) => res.json())
        .then((json) => setPlayer(json));
    }
  }, []);

  return <section>hello world</section>;
}
