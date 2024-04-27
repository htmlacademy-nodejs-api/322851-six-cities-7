import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch(error) {
      if (! (error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from ${filename}`));
      console.error(chalk.red(error.message));
    }

  }
}
