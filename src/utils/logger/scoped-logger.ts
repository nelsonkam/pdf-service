import { logger } from '@utils/logger/logger';

export class ScopedLogger {
  private readonly scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  public debug(message: string): void {
    this.log('debug', message);
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public warn(message: string): void {
    this.log('warn', message);
  }

  public error(message: string): void {
    this.log('error', message);
  }

  private log(level: string, message: string): void {
    logger.log(level, `${this.formatScope()} ${message}`);
  }

  private formatScope(): string {
    return `[${this.scope}]`;
  }
}
