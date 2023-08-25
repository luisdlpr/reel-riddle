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
      const test = await prisma.test.findMany();
      res.status(200).json({ response: test });
      break;
    case "POST":
      console.log(req.body);
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
