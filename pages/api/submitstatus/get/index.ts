import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let userMemo: {
      [key: string]: {
        name: string;
        color: string;
      };
    } = {};

    let cursor = req.query.cursor;
    let user = ((req.query.user as string) || "").replace(".-.", "#");

    let userFindWhere = undefined;

    if (user) {
      let x = await prisma.user.findFirst({
        where: {
          nickName: user,
        },
      });
      if (x == null) {
        res.send({
          err: "User not found.",
        });
        resolve();
        return;
      }
      userFindWhere = x.id;
    }

    let problem = undefined;

    if (typeof req.query.problem == "string" && req.query.problem.length > 0) {
      problem = req.query.problem;
    }

    if (cursor == undefined || cursor == null) {
      res.send(
        JSON.stringify({
          err: "Cursor is not valid.",
        })
      );
      resolve();
      return;
    }
    cursor = cursor as string;
    let dt: any;
    if (cursor.length > 0) {
      dt = await prisma.sourceCode.findMany({
        cursor: {
          id: cursor,
        },
        orderBy: {
          time: "desc",
        },
        where: {
          problem: problem,
          user: userFindWhere,
        },
        skip: 1,
        take: 30,
      });
    } else {
      dt = await prisma.sourceCode.findMany({
        orderBy: {
          time: "desc",
        },
        where: {
          problem: problem,
          user: userFindWhere,
        },
        skip: 0,
        take: 30,
      });
    }

    for (let i = 0; i < dt.length; i++) {
      if (userMemo[dt[i].user]) {
        dt[i].user = JSON.stringify(userMemo[dt[i].user]);
      } else {
        let usr = await prisma.user.findFirst({
          where: {
            id: dt[i].user,
          },
        });
        if (usr == null) continue;
        userMemo[dt[i].user] = {
          name: usr.nickName,
          color: usr.nameColor,
        };
        dt[i].user = JSON.stringify(userMemo[dt[i].user]);
      }
    }

    res.send(JSON.stringify(dt));
    resolve();
  });
}
