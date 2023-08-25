import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  switch (method) {
    case "GET":
      // GET request: test
      console.log(process.env.COOL);
      if (process.env.COOL === "banana") {
        res.status(200).json({ response: "access granted" });
      } else {
        res.status(200).json({ response: "access denied" });
      }
      break;
    default:
      // No matching method
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
