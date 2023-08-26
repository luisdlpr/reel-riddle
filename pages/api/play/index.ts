import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { pullMovies } from "../adminUpdate";

const prisma = new PrismaClient();

const getHintSpaces = (
  title: string,
): { spaces: number; blanks: number[] | [] } => {
  let blanks = [];

  for (let i = 0; i < title.length; i++) {
    if (title[i] === " ") {
      blanks.push(i);
    }
  }

  return {
    spaces: title.length,
    blanks,
  };
};

// const resetPuzzle = async () => {
//   const options: RequestInit = {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//     },
//   };

//   const res = await fetch("/api/adminUpdate?password=secure-password", options);
//   const resJSON = await res.json();

//   return resJSON;
// };

const getPuzzle = async (res: NextApiResponse) => {
  const puzzle = await prisma.movie.findFirst({
    where: {
      played: new Date(new Date(Date.now()).toDateString()),
    },
  });

  if (puzzle == null) {
    // some reset behaviour
    await pullMovies();
    return res
      .status(500)
      .json({ error: "active puzzle not found, please refresh" });
  }

  const space_hints = getHintSpaces(puzzle.title);

  delete (puzzle as any).title;
  delete (puzzle as any).poster_path;

  return res.status(200).json({ ...puzzle, space_hints });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      return getPuzzle(res);
    default:
      // No matching method
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
