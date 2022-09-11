import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../util/prisma";
import { uid } from "uid";
import axios from "axios";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let query = req.query;
    let uToken = req.headers.authorization as string;

    const curr = new Date();

    // 2. UTC 시간 계산
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + KR_TIME_DIFF);

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

        prisma.submittedCode
          .create({
            data: {
              id: uidX,
              code: body,
            },
          })
          .then((y) => {
            prisma.problem
              .update({
                where: {
                  id: problem,
                },
                data: {
                  solveRequestedCount: v.solveRequestedCount + 1,
                },
              })
              .then(() => {
                prisma.sourceCode
                  .create({
                    data: {
                      id: uidX,
                      score: 0,
                      type: type,
                      user: uToken,
                      problem: problem,
                      time: kr_curr,
                    },
                  })
                  .then((v) => {
                    axios
                      .post(
                        (process.env.JUDGE_SPREADER_URL as string).replace(
                          "_id_",
                          uidX
                        )
                      )
                      .then((v) => {
                        res.send(
                          JSON.stringify({
                            suc: `Successfully requested your judge.`,
                          })
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
