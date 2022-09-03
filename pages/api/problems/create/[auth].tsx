import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../util/prisma";

export default async function CreateApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return new Promise<void>((resolve, reject) => {
    const token = req.query.auth as string;
    prisma.user
      .findFirst({
        where: {
          id: token,
        },
      })
      .then((v) => {
        if ((v?.permission as string[]).includes("admin")) {
          let name = req.query.name as string;
          let time = req.query.time as string;
          let memory = req.query.memory as string;
          let point = req.query.point as string;
          let id = req.query.id as string;
          let testCase = req.query.testcase as string;
          let body = req.query.body as string;

          if (name == "") {
            res.send(
              JSON.stringify({
                err: "Problem name is empty",
              })
            );
            resolve();
            return;
          }

          if (time == "") {
            res.send(
              JSON.stringify({
                err: "Problem time limit is empty",
              })
            );
            resolve();
            return;
          }

          if (memory == "") {
            res.send(
              JSON.stringify({
                err: "Problem memory limit is empty",
              })
            );
            resolve();
            return;
          }

          if (point == "") {
            res.send(
              JSON.stringify({
                err: "Problem point is empty",
              })
            );
            resolve();
            return;
          }

          if (testCase == "") {
            res.send(
              JSON.stringify({
                err: "Problem testCase is empty",
              })
            );
            resolve();
            return;
          }

          let testCaseJSON: any[] = [];
          let num_memory = parseInt(memory);
          let num_time = parseInt(time);
          let num_point = parseInt(point);

          if (num_memory > 1024) {
            res.send(
              JSON.stringify({
                err: "Problem memory limit is too large",
              })
            );
            resolve();
            return;
          }

          if (num_memory < 1) {
            res.send(
              JSON.stringify({
                err: "Problem memory limit is too small",
              })
            );
            resolve();
            return;
          }

          if (num_time < 0) {
            res.send(
              JSON.stringify({
                err: "Problem time limit is less than zero",
              })
            );
            resolve();
            return;
          }

          if (num_time > 100000) {
            res.send(
              JSON.stringify({
                err: "Problem time limit is bigger than 100sec",
              })
            );
            resolve();
            return;
          }

          if (num_point < 0) {
            res.send(
              JSON.stringify({
                err: "Problem point is less than zero",
              })
            );
            resolve();
            return;
          }

          if (num_point > 10) {
            res.send(
              JSON.stringify({
                err: "Problem point is bigger than 10",
              })
            );
            resolve();
            return;
          }

          try {
            testCaseJSON = JSON.parse(testCase);
          } catch (e) {
            res.send(
              JSON.stringify({
                err: "Problem test case has an error.",
              })
            );
            resolve();
            return;
          }

          const then_ = () => {
            prisma.problem
              .create({
                data: {
                  body: body,
                  id: id,
                  maxMemoryMB: num_memory,
                  maxTime: num_time,
                  name: name,
                  testCase: testCaseJSON,
                  point: num_point,
                  solvedPeopleCount: 0,
                  solveRequestedCount: 0,
                },
              })
              .then((v) => {
                res.send(
                  JSON.stringify({
                    suc: `Problem with id ${id} created!`,
                  })
                );
                resolve();
                return;
              });
          };

          // is already existing
          prisma.problem
            .findFirst({
              where: {
                id: id,
              },
            })
            .then((v) => {
              if (v) {
                res.send(
                  JSON.stringify({
                    err: `Problem with id ${id} already exists`,
                  })
                );
                resolve();
                return;
              }
              then_();
            });
        } else {
          res.end(
            JSON.stringify({
              err: "You do not have permission to create a problem",
            })
          );
        }
      });
  });
}
