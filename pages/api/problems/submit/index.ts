import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { uid } from "uid";
const prisma = new PrismaClient();
import axios from "axios";
import { getToken } from "next-auth/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    if (process.env.NODE_ENV == "production") {
      res.send(
        JSON.stringify({
          err: "Submit function is not supported on release version",
        })
      );
      resolve();
      return;
    }

    let query = req.query;
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
    if ((token.permission as string[]).includes("not_submit")) {
      res.send(
        JSON.stringify({
          err: "Not has permission to submit",
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

    let type = query.type as string;
    let body = query.body as string;
    let problem = query.problem as string;

    if (problem.length < 1) {
      res.send(
        JSON.stringify({
          err: "Problem number cannot be null",
        })
      );
      resolve();
      return;
    }

    if (body.length < 1) {
      res.send(
        JSON.stringify({
          err: "Source code cannot be null",
        })
      );
      resolve();
      return;
    }

    if (type.length < 1) {
      res.send(
        JSON.stringify({
          err: "Language type cannot be null",
        })
      );
      resolve();
      return;
    }
    prisma.problem
      .findFirst({
        where: {
          id: problem,
        },
      })
      .then((v) => {
        if (v == null || v == undefined) {
          res.send(
            JSON.stringify({
              err: "Problem not found",
            })
          );
          resolve();
          return;
        }

        let uidX = uid();

        prisma.sourceCode
          .create({
            data: {
              id: uidX,
              code: body,
              score: 0,
              type: type,
              user: uToken,
              problem: problem,
            },
          })
          .then((v) => {
            axios
              .post(
                (process.env.JUDGE_SPREADER_URL as string).replace("_id_", uidX)
              )
              .then((v) => {
                res.send(
                  JSON.stringify({
                    suc: `Successfully requested your judge.`,
                  })
                );
                console.log(
                  `Requested ${uidX} ${uToken} ${(
                    process.env.JUDGE_SPREADER_URL as string
                  ).replace("_id_", uidX)}`
                );
                resolve();
                return;
              })
              .catch((err) => {
                res.send(
                  JSON.stringify({
                    err: `Err / ${err}`,
                  })
                );
                resolve();
                return;
              });
          })
          .catch((err) => {
            res.send(
              JSON.stringify({
                err: `Err / ${err}`,
              })
            );
            resolve();
            return;
          });
      })
      .catch((err) => {
        res.send(
          JSON.stringify({
            err: `Err / ${err}`,
          })
        );
        resolve();
        return;
      });
  });
}
