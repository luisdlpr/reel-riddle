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
        <table className="min-w-fit table-fixed bg-indigo-100 shadow-lg">
          <thead>
            <tr>
              <th className="bg-indigo-300 border text-left px-8 py-4">Rank</th>
              <th className="bg-indigo-300 border text-left px-8 py-4">User</th>
              <th className="bg-indigo-300 border text-left px-8 py-4">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.username}>
                <td className="border px-8 py-4 text-left">#{entry.rank}</td>
                <td className="border px-8 py-4 text-left">{entry.username}</td>
                <td className="border px-8 py-4 text-left">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {player == null || player.response == null ? (
        <h1 className="mt-5">Make an account to join the leaderboard!</h1>
      ) : (
        <table className="mt-5 min-w-fit table-fixed bg-indigo-100 shadow-lg">
          <thead>
            <tr>
              <th className="bg-indigo-300 border text-left px-8 py-4">Rank</th>
              <th className="bg-indigo-300 border text-left px-8 py-4">User</th>
              <th className="bg-indigo-300 border text-left px-8 py-4">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-8 py-4 text-left">#{player.rank}</td>
              <td className="border px-8 py-4 text-left">
                {player.response.username}
              </td>
              <td className="border px-8 py-4 text-left">
                {player.response.score}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
}
