import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';

export class PinoLogger implements Logger {
  private logger: PinoInstance;

  constructor() {

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: {}
        }
      ]
    })
    this.logger = pino({}, multiTransport);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warning(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
