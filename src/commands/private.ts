import { Command } from 'commander';
import { getPrivateClient } from '../buda';

function print(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function handle(promise: Promise<unknown>) {
  promise.then(print).catch((err: Error) => {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

export function registerPrivateCommands(program: Command) {
  program
    .command('me')
    .description('Get current user information')
    .action(() => handle(getPrivateClient().me()));

  program
    .command('balance [currency]')
    .description('Get account balance (all currencies if none specified)')
    .action((currency?: string) => handle(getPrivateClient().balance(currency)));

  program
    .command('orders <market>')
    .description('List orders for a market')
    .option('-p, --per <per>', 'Results per page')
    .option('--page <page>', 'Page number')
    .option('-s, --state <state>', 'Filter by state (e.g. pending)')
    .action((market: string, opts: { per?: string; page?: string; state?: string }) => {
      handle(getPrivateClient().order_pages(market, opts.per, opts.page, opts.state));
    });

  const order = program.command('order').description('Order management');

  order
    .command('new <market> <type> <price-type> <limit> <amount>')
    .description('Create a new order (type: bid|ask, price-type: limit|market)')
    .action((market: string, type: string, priceType: string, limit: string, amount: string) => {
      handle(getPrivateClient().new_order(market, type, priceType, parseFloat(limit), parseFloat(amount)));
    });

  order
    .command('cancel <id>')
    .description('Cancel an order by ID')
    .action((id: string) => handle(getPrivateClient().cancel_order(parseInt(id, 10))));

  order
    .command('cancel-all <market> <type>')
    .description('Cancel all orders for a market and type (bid|ask)')
    .action((market: string, type: string) => handle(getPrivateClient().cancel_orders(market, type)));

  order
    .command('get <id>')
    .description('Get a single order by ID')
    .action((id: string) => handle(getPrivateClient().single_order(parseInt(id, 10))));

  order
    .command('batch <diff>')
    .description('Create multiple orders in a batch (pass JSON array as string)')
    .action((diff: string) => handle(getPrivateClient().batch_orders(JSON.parse(diff))));

  program
    .command('deposits <currency>')
    .description('List deposits for a currency')
    .option('-p, --per <per>', 'Results per page')
    .option('--page <page>', 'Page number')
    .option('-s, --state <state>', 'Filter by state')
    .action((currency: string, opts: { per?: string; page?: string; state?: string }) => {
      handle(getPrivateClient().deposits(currency, opts.per, opts.page, opts.state));
    });

  program
    .command('withdrawals <currency>')
    .description('List withdrawals for a currency')
    .option('-p, --per <per>', 'Results per page')
    .option('--page <page>', 'Page number')
    .option('-s, --state <state>', 'Filter by state')
    .action((currency: string, opts: { per?: string; page?: string; state?: string }) => {
      handle(getPrivateClient().withdrawals(currency, opts.per, opts.page, opts.state));
    });

  program
    .command('withdraw <currency> <amount> <address>')
    .description('Withdraw cryptocurrency to an address')
    .option('--simulate', 'Simulate withdrawal without executing')
    .action((currency: string, amount: string, address: string, opts: { simulate?: boolean }) => {
      handle(getPrivateClient().withdrawal(currency, parseFloat(amount), address, opts.simulate));
    });

  program
    .command('lightning-withdraw <amount> <invoice>')
    .description('Withdraw via Lightning Network')
    .option('--simulate', 'Simulate withdrawal without executing')
    .action((amount: string, invoice: string, opts: { simulate?: boolean }) => {
      handle(getPrivateClient().lightning_withdrawal(parseFloat(amount), invoice, opts.simulate));
    });

  program
    .command('lightning-invoice <amount> <currency>')
    .description('Create a Lightning Network invoice')
    .option('-m, --memo <memo>', 'Invoice memo')
    .option('-e, --expiry <seconds>', 'Expiry in seconds')
    .action((amount: string, currency: string, opts: { memo?: string; expiry?: string }) => {
      handle(getPrivateClient().lightning_network_invoices(parseFloat(amount), currency, opts.memo, opts.expiry));
    });

  program
    .command('fiat-deposit <currency> <amount>')
    .description('Initiate a fiat deposit')
    .option('--simulate', 'Simulate deposit without executing')
    .action((currency: string, amount: string, opts: { simulate?: boolean }) => {
      handle(getPrivateClient().new_fiat_deposit(currency, parseFloat(amount), opts.simulate));
    });

  const addr = program.command('address').description('Address management');

  addr
    .command('new <currency>')
    .description('Create a new deposit address for a currency')
    .action((currency: string) => handle(getPrivateClient().new_crypto_address(currency)));
}
