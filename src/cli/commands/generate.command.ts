import { TSVOfferGenerator, TSVFileWriter } from '../../shared/libs/index.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { Command } from './command.interface.js';
import got from 'got';
import chalk from 'chalk';
export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch(error) {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const offerGenerator = new TSVOfferGenerator(this.initialData);
    const fileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      fileWriter.write(offerGenerator.generate());
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    try {
      await this.load(url);
      await this.write(filepath, parseInt(count, 10));
      console.log(chalk.green(`File ${filepath} was created`));
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
