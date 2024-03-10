import { config } from "@/libs/config";
import { Logger, LoggerInterface } from "@/libs/logs";
import type { Channel } from "amqplib";
import { connect } from "amqplib";
import { Service } from "typedi";

@Service()
export class AMPQService {
  @Logger("AMPQService")
  log: LoggerInterface;

  static delay = 600;

  protected channel: Channel;
  protected sentMessages: Record<string, number> = {};
  protected routingKey: string | undefined;

  /**
   * Launches AMPQService
   */
  async launch() {
    this.routingKey = "-MYAPP-";
    if (config.AMPQURL && config.AMPQEXCHANGE && this.routingKey) {
      try {
        const conn = await connect(config.AMPQURL);
        this.channel = await conn.createChannel();
      } catch (e) {
        console.log("Cant connect AMPQ");
        process.exit(2);
      }
    } else {
      this.log.warn("AMPQ service is disabled");
    }
  }
  info(text: string) {
    this.log.info(`[INFO]:${text}`);
  }
  error(text: string) {
    this.log.error(`[ERROR]:${text}`);
  }

  protected send(text: string, important = false) {
    if (this.channel && this.routingKey) {
      const lastTime = this.sentMessages[text];
      if (lastTime && lastTime < Date.now() / 1000 + AMPQService.delay) {
        return;
      }
      this.sentMessages[text] = Date.now() / 1000;

      this.channel.publish(
        config.AMPQEXCHANGE!,
        this.routingKey,
        Buffer.from(text),
        {
          appId: "MYAPP",
          headers: {
            important,
          },
          persistent: important,
          contentType: "text/plain",
          priority: important ? 9 : 4,
        },
      );
    }
  }
}
