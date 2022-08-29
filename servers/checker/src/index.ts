import express from "express";
import "dotenv/config";
import { rm, writeFile } from "fs";
import { join as pjoin } from "path";
import { PrismaClient, Problem, SourceCode } from "@prisma/client";
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

interface Language {
  fileExt: string;
  buildCommand: string | null;
  runCommand: string | null;
}

let langs: { [key: string]: Language } = {
  js: {
    fileExt: "js",
    buildCommand: null,
    runCommand: "node $file",
  },
  cpp: {
    fileExt: "cpp",
    buildCommand: "g++ -o $output $file",
    runCommand: "$file",
  },
};

async function judge(v: SourceCode) {
  return new Promise<JudgeResult>((resolve, reject) => {
    let pro: Problem;
    let lang: Language;
    let codeFilePath: string;
    let buildedFilePath: string;

    let maxRam = 0;
    let error: string | null = null;
    let ntime = 0;
    let scoreSum = 0;

    const build = () => {
      return new Promise<string>((resolve, reject) => {
        if (lang.buildCommand == null) {
          buildedFilePath = codeFilePath;
          resolve("");
          return;
        }

        buildedFilePath = pjoin(process.env.CODE_DIR as string, v.id);

        let buildCMD = lang.buildCommand
          .replace("$file", codeFilePath)
          .replace("$output", buildedFilePath);

        console.log("Build command: " + buildCMD);

        let cmdSplit = buildCMD.split(" ");

        let execa_arga = cmdSplit[0];
        let execa_argb = cmdSplit.slice(1);

        let exec = execa(execa_arga, execa_argb);

        let output = "";
        let errput = "";
        exec?.stdout?.on("data", (data: string) => {
          output += data;
        });

        exec?.stderr?.on("data", (data: string) => {
          errput += data;
        });

        exec.on("exit", () => {
          resolve(errput);
        });
      });
    };

    const judgeSub = (input: string, routput: string) => {
      return new Promise<boolean>(async (resolve, reject) => {
        let execCMD = lang.runCommand?.replace(
          "$file",
          buildedFilePath
        ) as string;
        let cmdSplit = execCMD.split(" ");
        let execa_arga = cmdSplit[0];
        let execa_argb = cmdSplit.slice(1);

        let exec = execa(execa_arga, execa_argb);

        let st: Date;
        let ed: Date;
        let right = true;

        const maxRAMBytes = pro.maxMemoryMB * 1000000;

        let output = "";
        let errorput = "";
        let ramlimited = false;
        let ramInvi: any;

        let tx = 0;

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

          tx += ramCheckCycle;

          if (tx > pro.maxTime) {
            error = "Timeout";
            clearInterval(ramInvi);
            exec.kill("SIGKILL");
          }
        }

        exec.on("spawn", () => {
          st = new Date();
          exec.stdin?.write(input + "\n");
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
          ntime = Math.max(ntime, ed.getTime() - st.getTime());

          if (ramlimited) {
            right = false;
          } else if (errorput) {
            right = false;
          } else {
            if (output.trim() != routput.trim()) {
              right = false;
            }
          }

          if (ntime > pro.maxTime && (error == "" || error == null)) {
            error = "Timeout";
          }

          clearInterval(ramInvi);
          resolve(right);
        });
      });
    };

    const run = () => {
      return new Promise<JudgeResult>(async (resolve, reject) => {
        let testCaseGroup = pro.testCase as Array<
          Array<{ input: string; output: string } | number>
        >;

        for (let i = 0; i < testCaseGroup.length; i++) {
          let testCases = testCaseGroup[i].slice(1);
          let thisGroupScore = testCaseGroup[i][0] as number;

          let rig = true;

          for (let j = 0; j < testCases.length; j++) {
            let testCase = testCases[j] as {
              input: string;
              output: string;
            };
            rig = (await judgeSub(testCase.input, testCase.output)) && rig;
            if (!rig) break;
          }

          if (rig) {
            scoreSum += thisGroupScore;
          }
        }

        resolve({
          error: error,
          ram: maxRam,
          score: scoreSum,
          time: ntime,
        });
      });
    };

    prisma.problem
      .findFirst({
        where: {
          id: v.problem,
        },
      })
      .then(async (p) => {
        if (p == null) return;
        if (p.testCase == null) return;

        lang = langs[v.type];
        pro = p;
        codeFilePath = pjoin(
          process.env.CODE_DIR as string,
          v.id + "." + lang.fileExt
        );

        writeFile(codeFilePath, v.code, async (err) => {
          let builded = await build();

          let result: JudgeResult = {
            error: builded,
            ram: 2147483647,
            score: 0,
            time: 2147483647,
          };
          if (builded == "") {
            result = await run();
            console.log("Judge Done!");
          } else {
            console.log("Judge Done with error.");
          }
          resolve(result);
        });
      });
  });
}

function queueing() {
  if (childs > maxChildsCount || queue.length == 0) return;

  let qf = queue[0];
  queue.shift();

  childs++;

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
              error: (jresult.error || "").toString(),
              score: jresult.score || 0,
            },
          })
          .then(() => {
            childs--;
            queueing();
          });
      };

      // Judge
      judge(v).then((v) => {
        jresult = v;
        updateDB_Result();
      });
    });
}

app.post("/judge", (req, res) => {
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
