#!/usr/bin/env node

import { CliApplication, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

function bootstrap() {
  const cliAppliaction = new CliApplication();
  cliAppliaction.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand()
  ]);

  cliAppliaction.processCommand(process.argv);

}

bootstrap();
