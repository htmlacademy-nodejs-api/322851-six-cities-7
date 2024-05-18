import { Logger as PinoInstance, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { injectable } from 'inversify';
import { getErrorMessage } from '../../helpers/index.js';

@injectable()
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
    });
    this.logger = pino({}, multiTransport);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warning(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(getErrorMessage(error), message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
