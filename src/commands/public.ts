import { Command } from 'commander';
import { getPublicClient, getPrivateClient } from '../buda';

function print(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function handle(promise: Promise<unknown>) {
  promise.then(print).catch((err: Error) => {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

export function registerPublicCommands(program: Command) {
  program
    .command('markets')
    .description('List all available markets')
    .action(() => handle(getPublicClient().markets()));

  program
    .command('market <market>')
    .description('Get details for a specific market (e.g. btc-clp)')
    .action((market: string) => handle(getPublicClient().market(market)));

  program
    .command('tickers')
    .description('Get tickers for all markets')
    .action(() => handle(getPublicClient().tickers()));

  program
    .command('ticker <market>')
    .description('Get ticker for a market (e.g. btc-clp)')
    .action((market: string) => handle(getPublicClient().ticker(market)));

  program
    .command('orderbook <market>')
    .description('Get order book for a market')
    .action((market: string) => handle(getPublicClient().order_book(market)));

  program
    .command('trades <market>')
    .description('Get recent trades for a market')
    .option('-t, --timestamp <timestamp>', 'Filter trades after this timestamp')
    .option('-l, --limit <limit>', 'Max number of trades to return')
    .action((market: string, opts: { timestamp?: string; limit?: string }) => {
      handle(getPublicClient().trades(market, opts.timestamp, opts.limit));
    });

  program
    .command('volume <market>')
    .description('Get traded volume for a market')
    .action((market: string) => handle(getPublicClient().volume(market)));

  program
    .command('fees <currency> <type>')
    .description('Get fees for a currency (type: deposit or withdrawal)')
    .action((currency: string, type: string) => handle(getPublicClient().fees(currency, type)));

  program
    .command('quotation <market> <type> <amount>')
    .description('Get quotation for a market (type: bid_given_earned_base, etc.)')
    .option('-l, --limit <limit>', 'Limit price')
    .action((market: string, type: string, amount: string, opts: { limit?: string }) => {
      handle(getPrivateClient().get_quotation(market, type, parseFloat(amount), opts.limit));
    });
}
