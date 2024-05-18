import { getErrorMessage } from '../../helpers/index.js';
import { Logger } from '../index.js';
import chalk from 'chalk';


export class ConsoleLogger implements Logger {

  public info(message: string, ...args: unknown[]): void {
    console.info(chalk.green(message), ...args);
  }

  public warning(message: string, ...args: unknown[]): void {
    console.warn(chalk.yellow(message), ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(chalk.red(getErrorMessage(error)), chalk.red(message), ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    console.debug(chalk.blue(message), ...args);
  }

}
