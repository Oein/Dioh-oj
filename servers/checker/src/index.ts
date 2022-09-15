import express from "express";
import "dotenv/config";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join as pjoin } from "path";
import { PrismaClient, SourceCode, Problem } from "@prisma/client";
import { execSync, spawn } from "child_process";
import pidusage from "pidusage";

const prisma = new PrismaClient();
const maxChildsCount = 5;

const codeDir = process.env.CODE_DIR as string;
const memoryCheckMS = 10;

let app = express();
let port = process.env.PORT || 5690;

app.get("/", (req, res) => {
  res.send("Hello Judge!");
});

let queue: string[] = [];
let childs = 0;

interface JudgeResult {
  error: string | null;
  errorType: string | null;
  score: number;
  ram: number;
  time: number;
  scoreTypes: string[];
}

interface Language {
  fileExt: string;
  buildCommand: string | null;
  runCommand: string | null;
}

let langs: { [key: string]: Language } = {
  js: {
    fileExt: "cjs",
    buildCommand: null,
    runCommand: "node $file",
  },
  cpp: {
    fileExt: "cpp",
    buildCommand: "g++ -o $output $file",
    runCommand: "$file",
  },
  py: {
    fileExt: "py",
    buildCommand: null,
    runCommand: "python3 $file",
  },
};

export function getTmpPath(uid: string) {
  return pjoin(codeDir, uid);
}

function initTempEnv(uid: string) {
  const tmpPath = getTmpPath(uid);
  execSync(
    `adduser --ingroup execute --disabled-password --no-create-home --force-badname ${uid}`,
    {
      stdio: "ignore",
    }
  );
  mkdirSync(tmpPath, { recursive: true });
  execSync(`chown ${uid} ${tmpPath}`, { stdio: "ignore" });

  return tmpPath;
}

function clearTempEnv(uid: string) {
  const tmpPath = getTmpPath(uid);
  rmSync(tmpPath, { recursive: true });
  execSync(`deluser ${uid}`, { stdio: "ignore" });
}

function getLimitString(memoryLimit: number | null, command: string) {
  return `${memoryLimit ? `ulimit -v ${memoryLimit * 1024};` : ""}${command}`;
}

type JudgeResult__ = "AC" | "TLE" | "WA" | "RE";

function isSame(in1: string, in2: string): boolean {
  let res1 = in1
      .replace(/"\n\n"/gi, "\n")
      .split("\n")
      .map((str) => str.trimEnd())
      .filter((x) => x),
    res2 = in2
      .replace(/"\n\n"/gi, "\n")
      .split("\n")
      .map((str) => str.trimEnd())
      .filter((x) => x);
  return res1.length === res2.length && res1.every((x, i) => x === res2[i]);
}

async function judge(v: SourceCode, sourcode: string) {
  let problem: Problem;
  let language = langs[v.type];
  let distFile: string;
  let maxMemoryUsage: number = 0;
  let maxTimeUsage: number = 0;

  const build = (
    buildCommand: string,
    output: string,
    src: string,
    username: string
  ) => {
    return new Promise<{ success: boolean; error: string }>(
      (resolve, reject) => {
        const child = spawn("su", [
          "-m",
          username,
          "-c",
          buildCommand.replace("$output", output).replace("$file", src),
        ]);

        let stdout = "",
          stderr = "";

        child.stdout.on("data", (data: any) => {
          stdout += data;
        });

        child.stderr.on("data", (data: any) => {
          stderr += data;
        });

        child.on("exit", function () {
          child.kill();
        });

        child.on("close", (code) => {
          if (stderr.length > 0) {
            resolve({
              success: false,
              error: stderr,
            });
          }
          resolve({
            success: true,
            error: stdout,
          });
        });
      }
    );
  };

  const judge = (
    input: string,
    output: string,
    runCommand: string,
    username: string
  ) => {
    return new Promise<JudgeResult__>((resolve, reject) => {
      let st = new Date().getTime();

      const child = spawn("su", ["-m", username, "-c", runCommand], {
        stdio: ["pipe", "pipe", "pipe"],
        detached: true,
      });

      let stdout = "",
        stderr = "";
      let timeouted = false;

      child.stdout.on("data", (data: any) => {
        stdout += data;
      });

      child.stderr.on("data", (data: any) => {
        stderr += data;
        if (!child.killed) child.kill();
      });

      child.stdin.write(input + "\n");
      child.stdin.end();

      let timeoutHandler = setTimeout(async () => {
        timeouted = true;
        if (!child.killed) child.kill();
        clearInterval(memoryUsageChecker);
        resolve("TLE");
      }, problem.maxTime + 100);

      let memoryUsageChecker = setInterval(() => {
        if (child.killed) {
          clearInterval(memoryUsageChecker);
          return;
        }

        if (child.pid) {
          pidusage(child.pid, (e, s) => {
            maxMemoryUsage = Math.max(maxMemoryUsage, s.memory);
          });
        }
      }, memoryCheckMS);

      child.on("exit", function () {
        clearTimeout(timeoutHandler);
        clearInterval(memoryUsageChecker);
        child.kill();
      });

      if (child.pid) {
        pidusage(child.pid, (e, s) => {
          maxMemoryUsage = Math.max(maxMemoryUsage, s.memory);
        });
      }

      child.on("close", (code) => {
        clearTimeout(timeoutHandler);
        clearInterval(memoryUsageChecker);

        let ed = new Date().getTime();

        maxTimeUsage = Math.max(maxTimeUsage, ed - st);

        if (stderr.length > 0) {
          console.log("RE ", stderr);
          resolve("RE");
        }

        if (isSame(output, stdout)) resolve("AC");
        else resolve("WA");
      });
    });
  };

  const judgeSubtask = (
    subtasks: (number | { input: string; output: string })[],
    username: string
  ) => {
    return new Promise<JudgeResult__>(async (resolve, reject) => {
      for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        if (typeof subtask == "number") continue;
        let result = await judge(
          subtask.input,
          subtask.output,
          getLimitString(
            problem.maxMemoryMB * 1024,
            (language.runCommand || "").replace("$file", distFile)
          ),
          username
        );

        if (result == "RE") {
          resolve("RE");
          return "RE";
        }

        if (result == "TLE") {
          resolve("TLE");
          return "TLE";
        }

        if (result == "WA") {
          resolve("WA");
          return "WA";
        }
      }

      resolve("AC");
      return "AC";
    });
  };

  return new Promise<JudgeResult>(async (resolve, reject) => {
    initTempEnv(v.id);

    let srcFile = pjoin(codeDir, v.id, `${v.id}.${language.fileExt}`);
    let buildOutputFile = pjoin(codeDir, v.id, `${v.id}`);

    writeFileSync(srcFile, sourcode, "utf-8");

    if (language.buildCommand) {
      let buildSuccess = await build(
        language.buildCommand,
        buildOutputFile,
        srcFile,
        v.id
      );

      if (buildSuccess.success == false) {
        console.log("Build failed");

        rmSync(srcFile);
        clearTempEnv(v.id);

        resolve({
          error: buildSuccess.error,
          errorType: "CE",
          ram: 2147483647,
          score: -1,
          scoreTypes: [],
          time: 2147483647,
        });
        return;
      }
    }

    distFile = language.buildCommand ? buildOutputFile : srcFile;

    let problem_ = await prisma.problem.findFirst({
      where: {
        id: v.problem,
      },
    });

    if (problem_ == null) {
      rmSync(srcFile);
      if (language.buildCommand) rmSync(distFile);
      clearTempEnv(v.id);

      resolve({
        error: "Problem Not Found",
        errorType: "PNF",
        ram: 2147483647,
        score: -1,
        scoreTypes: [],
        time: 2147483647,
      });

      return;
    }

    problem = problem_;

    let result: JudgeResult__[] = [];

    let tc = problem.testCase as (
      | number
      | { input: string; output: string }
    )[][];

    let score = 0;

    for (let i = 0; i < tc.length; i++) {
      let tcsx = tc[i];
      result.push(await judgeSubtask(tcsx, v.id));
      if (result[i] == "AC") score += tcsx[0] as number;
    }

    rmSync(srcFile);
    if (language.buildCommand) rmSync(distFile);
    clearTempEnv(v.id);

    resolve({
      error: null,
      errorType: null,
      ram: maxMemoryUsage,
      time: maxTimeUsage,
      score: score,
      scoreTypes: result,
    });
  });
}

async function queueing() {
  if (childs > maxChildsCount || queue.length == 0) return;

  let qf = queue[0];
  queue.shift();

  childs++;

  let sourceCd = await prisma.sourceCode.findFirst({
    where: {
      id: qf,
    },
  });

  if (sourceCd == null) {
    childs--;
    return;
  }

  let source = await prisma.submittedCode.findFirst({
    where: {
      id: qf,
    },
  });

  if (source == null) {
    childs--;
    return;
  }

  let result = await judge(sourceCd, source.code);

  console.log("RESULT", result);

  queueing();
}

app.post("/judge", (req, res) => {
  queue.push(req.query.id as string);
  res.send(req.query.id);
  if (childs <= maxChildsCount) queueing();
});

app.listen(port, () => {
  console.log(`------------------------------
           Checker             
           v1.0.0.0           
------------------------------`);
});
