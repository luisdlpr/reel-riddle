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
        // some reset behaviour
        return res
          .status(500)
          .json({ error: "active puzzle not found, please refresh" });
      }

      delete (puzzle as any).title;
      delete (puzzle as any).poster_path;

      res.status(200).json({ ...puzzle });
      break;
    case "POST":
      const rowData = req.body;
      const savedRow = await prisma.test.create({ data: rowData });
      res.status(200).json(savedRow);
      break;
    default:
      // No matching method
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
