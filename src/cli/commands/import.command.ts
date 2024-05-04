import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import chalk from 'chalk';
import { Offer } from '../../shared/types/offer.type.js';

export class ImportCommand implements Command {

  private onImportedOffer(offer: Offer) {
    console.log(offer);
  }

  private onFinishImport(lineCount: number) {
    console.log(chalk.green(`Was imported ${lineCount} offers`));
  }

  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onFinishImport);

    try {
      fileReader.read();
    } catch(error) {
      if (! (error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from ${filename}`));
      console.error(chalk.red(error.message));
    }

  }
}
