import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkWin = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestData = req.query;
  if (
    !(requestData.token && requestData.date) ||
    !(typeof requestData.token == "string")
  ) {
    return res.status(500).json({ error: "payload invalid." });
  }

  let user = await prisma.player.findFirst({
    where: {
      id: requestData.token,
    },
    select: {
      lastPlayed: true,
    },
  });

  if (user == null) {
    return res.status(500).json({ error: "no matching account" });
  }

  if (user.lastPlayed && user.lastPlayed.toDateString() == requestData.date) {
    let puzzle = await prisma.movie.findFirst({
      where: {
        played: new Date(new Date(Date.now()).toDateString()),
      },
    });
    if (puzzle == null) {
      return res.status(500).json({ error: "no matching puzzle" });
    }
    return res.status(200).json({
      answer: { title: puzzle.title, poster_path: puzzle.poster_path },
    });
  } else {
    return res.status(200).json({ answer: "none" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      return checkWin(req, res);
    default:
      // No matching method
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
