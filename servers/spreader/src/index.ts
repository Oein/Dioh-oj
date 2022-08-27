import axios from "axios";
import "dotenv/config";
import express from "express";

const port = process.env.PORT || 5680;
const app = express();

let myServers = require("../servers.json") as string[];

let serverStates: number[] = [];

for (let i = 0; i < myServers.length; i++) {
  serverStates.push(0);
}

app.post("/judge", (req, res) => {
  let id = req.query.id as string;

  let judgeServerIdx = serverStates.indexOf(Math.min(...serverStates));
  let judgeServerURL = myServers[judgeServerIdx];
  axios
    .post(`${judgeServerURL}/judge?id=${id}`)
    .then((v) => {
      console.log(`${id}/${judgeServerIdx}/${req.ip}`);
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      res.send(
        `Requested your judge ${id} on judge server no.${judgeServerIdx}`
      );
    });
});

app.listen(port, () => {
  console.log(`------------------------------
           Spreader           
           v1.0.0.0           
------------------------------`);
});
