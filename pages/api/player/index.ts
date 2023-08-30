import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const md5 = require("md5");
const prisma = new PrismaClient();

const logIn = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestData = req.query;
  if (
    !(
      requestData.username &&
      requestData.password &&
      typeof requestData.username === "string" &&
      typeof requestData.password === "string"
    )
  ) {
    return res.status(500).json({ error: "payload invalid." });
  }

  let answer = await prisma.player.findFirst({
    where: {
      username: requestData.username,
      password: requestData.password,
    },
    select: {
      id: true,
    },
  });

  if (answer != null) {
    return res.status(200).json({ token: answer.id });
  } else {
    return res.status(500).json({ error: "no matching account" });
  }
};

const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestData = JSON.parse(req.body);

  console.log(requestData);
  console.log(requestData.username);
  console.log(requestData.password);

  if (!(requestData.username && requestData.password)) {
    return res.status(500).json({ error: "payload invalid." });
  }

  let answer = await prisma.player.findFirst({
    where: {
      username: requestData.username,
    },
    select: {
      id: true,
    },
  });

  console.log(answer);

  if (answer != null) {
    return res.status(500).json({ error: "username taken." });
  } else {
    const newPlayer = await prisma.player.create({
      data: {
        username: requestData.username,
        password: requestData.password,
        score: 0,
      },
    });
    return res.status(200).json({ token: newPlayer.id });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      return logIn(req, res);
    case "POST":
      return signUp(req, res);
    default:
      // No matching method
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
