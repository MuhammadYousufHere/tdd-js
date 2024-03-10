import { formatDuration, intervalToDuration } from "date-fns";
import express from "express";
import { Gauge, register } from "prom-client";
import { Inject, Service } from "typedi";
import { Logger, LoggerInterface } from "@lib/logs";

const PORT = process.env.PORT || 8080;

@Service()
export class HealthChecker {
  @Logger("HealthChecker")
  log: LoggerInterface;

  /** simple expressjs server */
  public launch(): void {
    const start = new Date();
    const app = express();

    const latestBlockGauge = new Gauge({
      name: "eth_block_number",
      help: "Latest processed block",
    });
    const startTimeGauge = new Gauge({
      name: "start_time",
      help: "Start time, in unixtime",
    });
    startTimeGauge.set(Math.round(start.valueOf() / 1000));
    // pseudo-metric that provides metadata about the running binary
    const buildInfo = new Gauge({
      name: "liquidator_ts_build_info",
      help: "Build info",
      labelNames: ["version"],
    });
    buildInfo.set({ version: "v1" }, 1);
    app.get("/", (_, res) => {
      res.send({
        message: "App is up and healthy",
        uptime: formatDuration(intervalToDuration({ start, end: new Date() })),
      });
    });
    app.get("/metrics", async (_, res) => {
      try {
        const lastUpdated = Math.min(...[].filter(Boolean));
        latestBlockGauge.set(isFinite(lastUpdated) ? lastUpdated : 0);
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
      } catch (ex) {
        res.status(500).end(ex);
      }
    });

    app.listen(PORT, () => {
      this.log.info(`started on port ${PORT}`);
    });
  }
}
