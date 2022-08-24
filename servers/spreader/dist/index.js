"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const realtime_js_1 = require("@supabase/realtime-js");
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
let myServers = require("../servers.json");
let serverStates = [];
for (let i = 0; i < myServers.length; i++) {
    serverStates.push(0);
}
var client = new realtime_js_1.RealtimeClient(process.env.URL, {
    params: {
        apikey: process.env.API_KEY,
    },
});
client.connect();
client.onOpen(() => {
    console.log("Socket opened.");
    var databaseChanges = client.channel("realtime:*");
    databaseChanges.on("INSERT", (e) => {
        if (e.table == "SourceCode") {
            let id = e.record.id;
            let judgeServerURL = myServers[serverStates.indexOf(Math.min(...serverStates))];
            axios_1.default
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
client.onError((e) => console.log("Socket error", e));
console.log(`------------------------------
           Spreader           
           v1.0.0.0           
------------------------------`);
