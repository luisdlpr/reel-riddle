import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      // GET request: test
      const puzzle = await prisma.movie.findFirst({
        where: {
          played: new Date(new Date(Date.now()).toDateString()),
        },
      });

      if (puzzle == null) {
        res
          .status(500)
          .json({ error: "active puzzle not found, please refresh" });
      } else {
        res
          .status(200)
          .json({ title: puzzle.title, poster_path: puzzle.poster_path });
      }
      break;
    case "POST":
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
        res
          .status(500)
          .json({ error: "active puzzle not found, please refresh" });
      } else {
        if (answer.title.toLowerCase() === ansData.title) {
          res.status(200).json({ correct: true, ...answer });
        } else {
          res.status(200).json({ correct: false });
        }
      }
      break;
    default:
      // No matching method
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
