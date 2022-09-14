import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../../../util/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve, reject) => {
    let uToken = req.headers.authorization as string;
    let id = req.query.id as string;

    if (id == "") {
      res.send(
        JSON.stringify({
          err: "Do not have enough query parameters",
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
    if ((user.permission as string[]).includes("banned")) {
      res.send(
        JSON.stringify({
          err: "Banned from the server",
        })
      );
      resolve();
      return;
    }
    let pprb = await prisma.sourceCode.findFirst({
      where: {
        id: id,
      },
    });
    if (pprb == null) {
      res.send(
        JSON.stringify({
          err: "Source code not found",
        })
      );
      resolve();
      return;
    }
    if (
      pprb.user != user.id &&
      !(user.permission as string[]).includes("admin") &&
      !(user.solvedProblems as string[]).includes(pprb.problem)
    ) {
      res.send(
        JSON.stringify({
          err: "Only submiter can see this.",
        })
      );
      resolve();
      return;
    }
    let px = await prisma.submittedCode.findFirst({
      where: {
        id: id,
      },
    });
    if (px == null) {
      res.send(
        JSON.stringify({
          err: "Source code not found",
        })
      );
      resolve();
      return;
    }
    res.send(
      JSON.stringify({
        a: pprb,
        b: px,
      })
    );
    resolve();
  });
}
