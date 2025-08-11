import fs from "fs";
import path from "path";
import type { LogLevel, LoggerServiceOptions } from "types";

export default class LoggerService {
  level: LogLevel;
  quiet: boolean;
  logDir: string;
  projectName: string;
  levels: Record<LogLevel, number>;
  logFile: string;

  constructor({
    level = "debug",
    quiet = false,
    logDir = "logs",
    projectName = "forgeapi",
  }: LoggerServiceOptions = {}) {
    this.level = level;
    this.quiet = quiet;
    this.logDir = logDir;
    this.projectName = projectName;

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logFile = path.join(logDir, `${this.projectName}.log`);
  }

  #timestamp(): string {
    return new Date().toISOString();
  }

  #shouldLog(level: LogLevel): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  #writeToFile(level: LogLevel, message: string): void {
    const line = `${this.#timestamp()} ${level.toUpperCase()} ${message}\n`;
    fs.appendFileSync(this.logFile, line);
  }

  info(message: string): void {
    if (this.#shouldLog("info")) {
      if (!this.quiet) console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
      this.#writeToFile("info", message);
    }
  }

  warn(message: string): void {
    if (this.#shouldLog("warn")) {
      if (!this.quiet) console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`);
      this.#writeToFile("warn", message);
    }
  }

  error(message: string): void {
    if (this.#shouldLog("error")) {
      if (!this.quiet) console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
      this.#writeToFile("error", message);
    }
  }

  debug(message: string): void {
    if (this.#shouldLog("debug")) {
      if (!this.quiet) console.debug(`\x1b[90m[DEBUG]\x1b[0m ${message}`);
      this.#writeToFile("debug", message);
    }
  }
}
