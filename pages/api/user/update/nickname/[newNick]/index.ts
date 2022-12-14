import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let newNick = req.query.newNick;
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
    if ((token.permission as string[]).includes("not_update")) {
      res.send(
        JSON.stringify({
          err: "Not has permission to update.",
        })
      );
      resolve();
      return;
    }
    if ((token.permission as string[]).includes("banned")) {
      res.send(
        JSON.stringify({
          err: "Banned from the server.",
        })
      );
      resolve();
      return;
    }
    if (token.havingPoint < 100) {
      res.send(
        JSON.stringify({
          err: "Do not have enough point.",
        })
      );
      resolve();
      return;
    }
    token.nickName = `${newNick}#${token.nickName.split("#")[1]}`;

    let oldU = await prisma.user.findFirst({
      where: {
        nickName: token.nickName,
      },
    });

    if (oldU != null) {
      res.send(
        JSON.stringify({
          err: `User already exists with nickname ${token.nickName}`,
        })
      );
      resolve();
      return;
    }

    await prisma.user
      .update({
        where: {
          id: uToken,
        },
        data: {
          nickName: token.nickName,
          havingPoint: token.havingPoint - 100,
        },
      })
      .then((v) => {
        res.send(
          JSON.stringify({
            suc: "Successfully updated",
          })
        );
        resolve();
      })
      .catch((err) => {
        res.send(
          JSON.stringify({
            err: err.message,
          })
        );
        resolve();
        return;
      });
  });
}
