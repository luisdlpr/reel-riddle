import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPlayer = async (req: NextApiRequest, res: NextApiResponse) => {
  let token = req.query.player;
  if (typeof token != "string") {
    return res.status(500).json({ error: "player token not sent" });
  }

  const player = await prisma.player.findUnique({
    where: {
      id: token,
    },
    select: {
      username: true,
      score: true,
    },
  });

  if (player == null) {
    return res.status(500).json({ error: "player not found" });
  }

  const lowerRank = await prisma.player.count({
    where: {
      score: {
        gt: player.score,
      },
    },
  });
  res.status(200).json({ response: player, rank: lowerRank });
};

const getTop = async (res: NextApiResponse) => {
  const data = await prisma.player.findMany({
    take: 5,
    orderBy: {
      score: "desc",
    },
    select: {
      username: true,
      score: true,
    },
  });
  return res.status(200).json({ response: data });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const requestData = req.query;

  switch (method) {
    case "GET":
      if (requestData.player) {
        await getPlayer(req, res);
      } else {
        await getTop(res);
      }
      break;
    default:
      // No matching method
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
