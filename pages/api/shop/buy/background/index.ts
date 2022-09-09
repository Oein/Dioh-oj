import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let buyPictureIdx = req.query.buyPictureId;
    let uToken = req.headers.authorization as string;

    if (buyPictureIdx == null || buyPictureIdx == "") {
      res.send(
        JSON.stringify({
          err: "Do not have enough information to buy",
        })
      );
      resolve();
      return;
    }

    if (uToken == "") {
      res.send(
        JSON.stringify({
          err: "Not logged in",
        })
      );
      resolve();
      return;
    }
    let user = await prisma.user.findFirst({
      where: {
        id: uToken,
      },
    });
    if (user == null) {
      res.send(
        JSON.stringify({
          err: "Not logged in",
        })
      );
      resolve();
      return;
    }
    if ((user.permission as string[]).includes("not_buy")) {
      res.send(
        JSON.stringify({
          err: "Not has permission to buy",
        })
      );
      resolve();
      return;
    }
    if ((user.permission as string[]).includes("banned")) {
      res.send(
        JSON.stringify({
          err: "Banned from the server",
        })
      );
      resolve();
      return;
    }

    if (
      (user.HavingBackgroundImgIndexes as number[]).includes(
        parseInt(buyPictureIdx as string)
      )
    ) {
      res.send(
        JSON.stringify({
          err: "Already have that background image.",
        })
      );
      resolve();
      return;
    }

    if (user.havingPoint < 75) {
      res.send(
        JSON.stringify({
          err: "You do not have enough points to buy this background image.",
        })
      );
      resolve();
      return;
    }

    user.havingPoint -= 75; // remove points
    (user.HavingBackgroundImgIndexes as number[]).push(
      parseInt(buyPictureIdx as string)
    ); // add img

    await prisma.user.update({
      where: {
        id: uToken,
      },
      data: {
        havingPoint: user.havingPoint,
        HavingBackgroundImgIndexes: user.HavingBackgroundImgIndexes as any,
      },
    });

    res.send(
      JSON.stringify({
        suc: "Successfully purchased!",
      })
    );
    resolve();
    return;

    resolve();
  });
}
