import { Command } from 'commander';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

export function registerInitCommand(program: Command) {
  program
    .command('init')
    .description('Configure your Buda API credentials')
    .action(async () => {
      console.log('You can create your API keys at: https://www.buda.com/manejar_api_keys\n');

      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      const apiKey = await prompt(rl, 'Enter your API key: ');
      const apiSecret = await prompt(rl, 'Enter your API secret: ');
      rl.close();

      const envPath = path.resolve(process.cwd(), '.env');
      const content = `BUDA_API_KEY=${apiKey}\nBUDA_API_SECRET=${apiSecret}\n`;
      fs.writeFileSync(envPath, content, 'utf8');

      console.log(`\nCredentials saved to ${envPath}`);
    });
}
