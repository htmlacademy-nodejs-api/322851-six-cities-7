import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CliApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {

      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName} already registered`);
      }

      this.commands[command.getName()] = command;

    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultProgram();
  }

  public getDefaultProgram(): Command {
    if (!this.commands[this.defaultCommand]) {
      throw new Error('Default command is not registered');
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);

  }
}
