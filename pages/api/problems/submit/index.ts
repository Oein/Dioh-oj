import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    let query = req.query;

    let type = query.type;
    let body = query.body;

    res.send(`${type} ${body}`);
    resolve();
  });
}
