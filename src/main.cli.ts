#!/usr/bin/env node

import { CliApplication, HelpCommand, ImportCommand, VersionCommand, GenerateCommand } from './cli/index.js';

function bootstrap() {
  const cliAppliaction = new CliApplication();
  cliAppliaction.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  cliAppliaction.processCommand(process.argv);

}

bootstrap();
