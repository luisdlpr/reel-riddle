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

const postAnswer = async (req: NextApiRequest, res: NextApiResponse) => {
  const ansData = req.body;
  let answer = await prisma.movie.findFirst({
    where: {
      played: new Date(new Date(Date.now()).toDateString()),
    },
    select: {
      title: true,
      poster_path: true,
    },
  });

  if (answer == null) {
    res.status(500).json({ error: "active puzzle not found, please refresh" });
  } else {
    if (answer.title.toLowerCase() === ansData.title) {
      res.status(200).json({ correct: true, ...answer });
    } else {
      res.status(200).json({ correct: false });
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      return getPuzzle(res);
    case "POST":
      return postAnswer(req, res);
    default:
      // No matching method
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
