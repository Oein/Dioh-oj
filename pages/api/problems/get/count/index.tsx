import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    prisma.problem.count({}).then((v) => {
      res.send(v);
      resolve();
    });
  });
}
