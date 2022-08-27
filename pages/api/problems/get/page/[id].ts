import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  return new Promise<void>((resolve, reject) => {
    prisma.problem
      .findMany({
        skip: parseInt(id as string) * 100,
        take: 100,
      })
      .then((v) => {
        if (v == null) {
          res.send(`{"err":"No Problem Found"}`);
          resolve();
          return;
        }
        let outputJSON = [];
        let dtBase = v as any as any[];

        for (let i = 0; i < dtBase.length; i++) {
          outputJSON.push({
            name: dtBase[i].name,
            id: dtBase[i].id,
          });
        }
        res.send(JSON.stringify(outputJSON));
        resolve();
      });
  });
}
