import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import chalk from 'chalk';
import { Offer } from '../../shared/types/index.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { ConsoleLogger, DatabaseClient, Logger, MongoDatabaseClient } from '../../shared/libs/index.js';
import { UserService, UserModel, DefaultUserService } from '../../shared/modules/user/index.js';
import { CityModel, CityService, DefaultCityService } from '../../shared/modules/city/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseSetting } from '../../shared/const.js';

export class ImportCommand implements Command {
  private logger: Logger;
  private databaseClient: DatabaseClient;
  private userService: UserService;
  private cityService: CityService;
  private offerService: OfferService;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onFinishImport = this.onFinishImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private onFinishImport(lineCount: number) {
    console.log(chalk.green(`Was imported ${lineCount} offers`));
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(offer.host, this.salt);
    const city = await this.cityService.findOrCreate(offer.city);

    await this.offerService.create({
      ...offer,
      city: city.id,
      host: user.id
    }
    );

  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbName: string, salt: string): Promise<void> {
    const dbURI = getMongoURI(login, password, host, DatabaseSetting.DEFAULT_DB_PORT, dbName);
    this.salt = salt;

    await this.databaseClient.connect(dbURI);

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
      console.error(chalk.red(getErrorMessage(error)));
    }

  }
}
