#!/usr/bin/env node
import { config } from 'dotenv';
import { Command } from 'commander';
import { registerPublicCommands } from './commands/public';
import { registerPrivateCommands } from './commands/private';
import { registerInitCommand } from './commands/init';

config();

const program = new Command();

program
  .name('buda')
  .description('CLI for buda.com exchange')
  .version('0.1.0');

registerInitCommand(program);
registerPublicCommands(program);
registerPrivateCommands(program);

program.parse(process.argv);
