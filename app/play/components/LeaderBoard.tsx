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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gradient">
        Leaderboard
      </h2>
      
      {leaderboard != null && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Top Scorers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.username}
                    className={`border-b border-slate-600/30 ${
                      index < 3 ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-slate-300' :
                        index === 2 ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{entry.username}</td>
                    <td className="py-3 px-4 font-bold text-gradient">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {player == null || player.response == null ? (
        <div className="glass-card p-6 text-center">
          <p className="text-slate-300">Make an account to join the leaderboard!</p>
        </div>
      ) : (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Your Rank</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gradient-to-r from-violet-500/20 to-purple-500/20">
                  <td className="py-3 px-4 font-bold text-violet-400">
                    #{player.rank}
                  </td>
                  <td className="py-3 px-4 font-medium">{player.response.username}</td>
                  <td className="py-3 px-4 font-bold text-gradient">{player.response.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
