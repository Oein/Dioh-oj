import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let newBGIDX = req.query.newBGIDX;
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
    if (
      !(token.HavingBackgroundImgIndexes as number[]).includes(
        parseInt(newBGIDX as string)
      )
    ) {
      res.send(
        JSON.stringify({
          err: "You do not have that background image.",
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
          UserBackgroundImgIndex: parseInt(newBGIDX as string),
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
