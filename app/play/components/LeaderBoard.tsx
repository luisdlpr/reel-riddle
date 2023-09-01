import React from "react";

export default function LeaderBoard() {
  const [leaderboard, setLeaderboard] = React.useState<
    [{ username: string; score: number; rank: number }] | null
  >(null);
  const [player, setPlayer] = React.useState<{
    response: { username: string; score: number };
    rank: number;
  } | null>(null);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leaderboard`, {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => {
        let rankedJson = json.response;
        let rank = 1;
        for (let i = 0; i < rankedJson.length; i++) {
          if (i >= 1 && rankedJson[i].score != rankedJson[i - 1].score) {
            rank += 1;
          }
          rankedJson[i]["rank"] = rank;
        }
        setLeaderboard(rankedJson);
      });

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

  return (
    <section className="max-w-xl flex flex-col items-center justify-center">
      {leaderboard != null && (
        <table className="w-3/5 table-fixed">
          <thead>
            <tr>
              <th>rank</th>
              <th>user</th>
              <th>score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.username}>
                <td>#{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {player == null || player.response == null ? (
        <h1 className="mt-3">Make an account to join the leaderboard!</h1>
      ) : (
        <table className="w-3/5 table-fixed">
          <thead>
            <tr>
              <th>rank</th>
              <th>user</th>
              <th>score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#{player.rank}</td>
              <td>{player.response.username}</td>
              <td>{player.response.score}</td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
}
