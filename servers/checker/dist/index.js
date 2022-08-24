var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import "dotenv/config";
import { writeFile } from "fs";
import { join as pjoin } from "path";
import { PrismaClient } from "@prisma/client";
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
let queue = [];
let childs = 0;
function js(v) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            prisma.problem
                .findFirst({
                where: {
                    id: v.problem,
                },
            })
                .then((p) => __awaiter(this, void 0, void 0, function* () {
                if (p == null)
                    return;
                if (p.testCase == null)
                    return;
                let ptc = p.testCase;
                let maxRam = 0;
                let error = null;
                let ntime = 0;
                let scoreSum = 0;
                for (let i = 0; i < ptc.length && (error == null || error == ""); i++) {
                    let x = ptc[i];
                    let score = parseInt(x[0]);
                    let inouts = x.slice(1);
                    let right = true;
                    for (let j = 0; j < inouts.length && right && (error == null || error == ""); j++) {
                        yield (function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                return new Promise((resolve, reject) => {
                                    var _a, _b;
                                    let st;
                                    let ed;
                                    let exec = execa("node", [pjoin(process.env.CODE_DIR, v.id + "." + v.type)], {
                                        timeout: p.maxTime,
                                    });
                                    const maxRAMBytes = p.maxMemoryMB * 1000000;
                                    let output = "";
                                    let errorput = "";
                                    let ramlimited = false;
                                    let ramInvi;
                                    function ramMonitor() {
                                        if (exec.killed) {
                                            clearInterval(ramInvi);
                                            return;
                                        }
                                        try {
                                            pidusage(exec.pid)
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
                                        }
                                        catch (_a) {
                                            clearInterval(ramInvi);
                                            return;
                                        }
                                    }
                                    exec.on("spawn", () => {
                                        var _a;
                                        st = new Date();
                                        (_a = exec.stdin) === null || _a === void 0 ? void 0 : _a.write(inouts[j].input);
                                    });
                                    ramInvi = setInterval(ramMonitor, ramCheckCycle);
                                    (_a = exec.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                                        output += data.toString();
                                    });
                                    (_b = exec.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                                        error = errorput;
                                        clearInterval(ramInvi);
                                        exec.kill("SIGKILL");
                                    });
                                    exec.on("exit", () => {
                                        ed = new Date();
                                        if (ramlimited) {
                                            right = false;
                                        }
                                        else if (errorput) {
                                            right = false;
                                        }
                                        else {
                                            if (output.trim() != inouts[j].output.trim()) {
                                                right = false;
                                            }
                                        }
                                        ntime = Math.max(ntime, ed.getTime() - st.getTime());
                                        clearInterval(ramInvi);
                                        resolve();
                                    });
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
            }));
        });
    });
}
function QCLog() {
    console.log(`Q ${queue.length} , C ${childs}`);
}
function queueing() {
    if (childs > maxChildsCount)
        return;
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
        .then((v) => __awaiter(this, void 0, void 0, function* () {
        if (v == null)
            return;
        let jresult;
        const updateDB_Result = () => __awaiter(this, void 0, void 0, function* () {
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
        });
        writeFile(pjoin(process.env.CODE_DIR, v.id + "." + v.type), v.code, (err) => __awaiter(this, void 0, void 0, function* () {
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
            if (queue.length && childs <= maxChildsCount)
                queueing();
        }));
    }));
}
app.get("/judge", (req, res) => {
    queue.push(req.query.id);
    if (childs <= maxChildsCount)
        queueing();
    res.send(req.query.id);
});
app.listen(port, () => {
    console.log(`------------------------------
           Checker             
           v1.0.0.0           
------------------------------`);
});
