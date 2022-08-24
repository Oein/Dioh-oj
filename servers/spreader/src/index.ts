import { RealtimeClient } from "@supabase/realtime-js";
import axios from "axios";
import "dotenv/config";

let myServers = require("../servers.json") as string[];

let serverStates: number[] = [];

for (let i = 0; i < myServers.length; i++) {
  serverStates.push(0);
}

var client = new RealtimeClient(process.env.URL as string, {
  params: {
    apikey: process.env.API_KEY as string,
  },
});

client.connect();
client.onOpen(() => {
  console.log("Socket opened.");

  var databaseChanges = client.channel("realtime:*");
  databaseChanges.on("INSERT", (e: any) => {
    if (e.table == "SourceCode") {
      let id = e.record.id;

      let judgeServerURL =
        myServers[serverStates.indexOf(Math.min(...serverStates))];
      axios
        .get(`${judgeServerURL}/judge?id=${id}`)
        .then((v) => {
          console.log(`Judge ${id} on ${judgeServerURL} / ${v.data}`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });
  databaseChanges.onClose(() => {
    console.log("Realtime closed");
  });
  databaseChanges.onError(() => {
    console.log("Realtime error");
  });
  databaseChanges.subscribe();
});
client.onClose(() => console.log("Socket closed."));
client.onError((e: any) => console.log("Socket error", e));

console.log(`------------------------------
           Spreader           
           v1.0.0.0           
------------------------------`);
