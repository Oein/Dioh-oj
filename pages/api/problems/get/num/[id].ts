import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  return new Promise<void>((resolve, reject) => {
    prisma.problem
      .findFirst({
        where: {
          id: id as string,
        },
      })
      .then((v) => {
        if (v == null) {
          res.send(`{"err":"No Problem Found"}`);
          resolve();
          return;
        }
        res.send(
          JSON.stringify({
            body: v.body,
            id: v.id,
            name: v.name,
            maxTime: v.maxTime,
            maxMemoryMB: v.maxMemoryMB,
            point: v.point,
            solvedPeopleCount: v.solvedPeopleCount,
            solveRequestedCount: v.solveRequestedCount,
          })
        );
        resolve();
      });
  });
}
