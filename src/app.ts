import { Container, Inject, Service } from "typedi";
import { Logger, LoggerInterface } from "@lib/logs";
import { HealthChecker } from "./services";

@Service()
class App {
  @Logger("APP")
  log: LoggerInterface;

  @Inject()
  healthChecker: HealthChecker;

  public async launch(): Promise<void> {
    this.healthChecker.launch();
  }
}

export async function lanuachApp(): Promise<void> {
  await Container.get(App).launch();
}
