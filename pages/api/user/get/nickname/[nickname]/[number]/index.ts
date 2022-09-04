import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, number } = req.query;
  return new Promise<void>((resolve, reject) => {
    prisma.user
      .findFirst({
        where: {
          nickName: `${nickname as string}#${number as string}`,
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
