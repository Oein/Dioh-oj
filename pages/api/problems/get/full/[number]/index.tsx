import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { number } = req.query;
  return new Promise<void>(async (resolve, reject) => {
    let uToken = req.headers.authorization as string;
    if (uToken == "") {
      res.send(
        JSON.stringify({
          err: "Not logged in",
        })
      );
      resolve();
      return;
    }
    let token = await prisma.user.findFirst({
      where: {
        id: uToken,
      },
    });
    if (token == null) {
      res.send(
        JSON.stringify({
          err: "Not logged in",
        })
      );
      resolve();
      return;
    }
    if (!(token.permission as string[]).includes("admin")) {
      res.send(
        JSON.stringify({
          err: "Not has permission to do adminical things.",
        })
      );
      resolve();
      return;
    }
    if ((token.permission as string[]).includes("banned")) {
      res.send(
        JSON.stringify({
          err: "Banned from the server",
        })
      );
      resolve();
      return;
    }
    prisma.problem
      .findFirst({
        where: {
          id: number as string,
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
            testCase: v.testCase,
          })
        );
        resolve();
      });
  });
}
