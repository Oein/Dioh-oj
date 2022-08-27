import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  return new Promise<void>((resolve, reject) => {
    prisma.user
      .findFirst({
        where: {
          id: token as string,
        },
      })
      .then((v) => {
        if (v == null) {
          res.send(`{"err":"No User Found"}`);
          resolve();
          return;
        }

        res.send(JSON.stringify(v));
        resolve();
      });
  });
}
