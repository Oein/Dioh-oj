import express from "express";
import "dotenv/config";
import { rm, writeFile } from "fs";
import { join as pjoin } from "path";
import { PrismaClient, SourceCode } from "@prisma/client";
import { execa } from "execa";
import pidusage from "pidusage";

const prisma = new PrismaClient();
const maxChildsCount = 5;
const ramCheckCycle = 30;

let app = express();
let port = process.env.PORT || 5690;

app.get("/", (req, res) => {
  res.send("Hello Judge!");
});

let queue: string[] = [];
let childs = 0;

interface JudgeResult {
  error: string | null;
  score: number;
  ram: number;
  time: number;
}

async function js(v: SourceCode) {
  return new Promise<JudgeResult>((resolve, reject) => {
    prisma.problem
      .findFirst({
        where: {
          id: v.problem,
        },
      })
      .then(async (p) => {
        if (p == null) return;
        if (p.testCase == null) return;
        let ptc = p.testCase as any;
        let maxRam = 0;
        let error: string | null = null;
        let ntime = 0;
        let scoreSum = 0;
        for (let i = 0; i < ptc.length && (error == null || error == ""); i++) {
          let x = ptc[i];
          let score = parseInt(x[0]);
          let inouts = x.slice(1) as { input: string; output: string }[];
          let right = true;
          for (
            let j = 0;
            j < inouts.length && right && (error == null || error == "");
            j++
          ) {
            await (async function () {
              return new Promise<void>((resolve, reject) => {
                let st: Date;
                let ed: Date;
                let exec = execa(
                  "node",
                  [pjoin(process.env.CODE_DIR as string, v.id + "." + v.type)],
                  {
                    timeout: p.maxTime,
                  }
                );

                const maxRAMBytes = p.maxMemoryMB * 1000000;

                let output = "";
                let errorput = "";
                let ramlimited = false;
                let ramInvi: any;

                function ramMonitor() {
                  if (exec.killed) {
                    clearInterval(ramInvi);
                    return;
                  }
                  try {
                    pidusage(exec.pid as number)
                      .then((st) => {
                        maxRam = Math.max(maxRam, st.memory);
                        if (st.memory > maxRAMBytes) {
                          exec.kill("SIGKILL");
                          pidusage.clear();
                          ramlimited = true;
                        }
                      })
                      .catch((err) => {
                        if (exec.killed) {
                          clearInterval(ramInvi);
                          return;
                        }
                      });
                  } catch {
                    clearInterval(ramInvi);
                    return;
                  }
                }

                exec.on("spawn", () => {
                  st = new Date();
                  exec.stdin?.write(inouts[j].input);
                });

                ramInvi = setInterval(ramMonitor, ramCheckCycle);

                exec.stdout?.on("data", (data) => {
                  output += data.toString();
                });

                exec.stderr?.on("data", (data) => {
                  error = errorput;
                  clearInterval(ramInvi);
                  exec.kill("SIGKILL");
                });

                exec.on("exit", () => {
                  ed = new Date();
                  if (ramlimited) {
                    right = false;
                  } else if (errorput) {
                    right = false;
                  } else {
                    if (output.trim() != inouts[j].output.trim()) {
                      right = false;
                    }
                  }
                  ntime = Math.max(ntime, ed.getTime() - st.getTime());

                  clearInterval(ramInvi);
                  resolve();
                });
              });
            })();
          }

          if (right) {
            scoreSum += score;
          }
        }

        resolve({
          score: scoreSum,
          ram: maxRam,
          error: error,
          time: ntime,
        });
      });
  });
}

function QCLog() {
  console.log(`Q ${queue.length} , C ${childs}`);
}

function queueing() {
  if (childs > maxChildsCount) return;

  let qf = queue[0];
  queue.shift();

  childs++;

  QCLog();

  prisma.sourceCode
    .findUnique({
      where: {
        id: qf,
      },
    })
    .then(async (v) => {
      if (v == null) return;
      let jresult: JudgeResult;

      const updateDB_Result = async () => {
        prisma.sourceCode
          .update({
            where: {
              id: qf,
            },
            data: {
              usedMemory: jresult.ram.toString(),
              usedTime: jresult.time.toString(),
            },
          })
          .then(() => {
            childs--;
            QCLog();
          });
      };

      writeFile(
        pjoin(process.env.CODE_DIR as string, v.id + "." + v.type),
        v.code,
        async (err) => {
          switch (v.type.toLocaleLowerCase()) {
            case "cpp":
              break;
            case "js":
              js(v).then((result) => {
                jresult = result;
                updateDB_Result();
              });
              break;
            default:
              break;
          }

          if (queue.length && childs <= maxChildsCount) queueing();
        }
      );
    });
}

app.get("/judge", (req, res) => {
  queue.push(req.query.id as string);
  if (childs <= maxChildsCount) queueing();
  res.send(req.query.id);
});

app.listen(port, () => {
  console.log(`------------------------------
           Checker             
           v1.0.0.0           
------------------------------`);
});
