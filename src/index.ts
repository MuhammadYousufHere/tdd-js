import "dotenv/config";
import "reflect-metadata";

import { lanuachApp } from "./app";

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

(async () => {
  lanuachApp();
})();
