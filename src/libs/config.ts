import dotenv from "dotenv";
import { num, str, url, cleanEnv } from "envalid";

dotenv.config({});

export const config = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  PORT: num(),
  AMPQURL: url(),
  AMPQEXCHANGE: str(),
  ROUTINGKEY: str(),
});
