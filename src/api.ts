import express from "express";
import { MempoolMonitor } from "./MempoolMonitor";
const app = express();
const monitor = new MempoolMonitor(process.env.BASE_WS_RPC || "wss://mainnet.base.org");
monitor.start();
app.get("/api/stats", (_, res) => res.json(monitor.getStats()));
app.get("/health", (_, res) => res.json({ status: "ok", chain: "base" }));
app.listen(3000, () => console.log("Mempool API running on :3000"));
