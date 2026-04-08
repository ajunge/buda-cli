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
    .option('--client-id <clientId>', 'Custom client ID for the order')
    .action((market: string, type: string, priceType: string, limit: string, amount: string, opts: { clientId?: string }) => {
      handle(getPrivateClient().new_order(market, type, priceType, parseFloat(limit), parseFloat(amount), opts.clientId));
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

  order
    .command('get-by-client-id <client-id>')
    .description('Get an order by client ID')
    .action((clientId: string) => handle(getPrivateClient().order_by_client_id(clientId)));

  order
    .command('cancel-by-client-id <client-id>')
    .description('Cancel an order by client ID')
    .action((clientId: string) => handle(getPrivateClient().cancel_order_by_client_id(clientId)));

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
      handle(getPrivateClient().new_crypto_withdrawal(currency, parseFloat(amount), address, opts.simulate));
    });

  program
    .command('fiat-withdraw <currency> <amount>')
    .description('Withdraw fiat currency')
    .option('--simulate', 'Simulate withdrawal without executing')
    .action((currency: string, amount: string, opts: { simulate?: boolean }) => {
      handle(getPrivateClient().new_fiat_withdrawal(currency, parseFloat(amount), opts.simulate));
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

  addr
    .command('get <currency> [address-id]')
    .description('Get deposit address(es) for a currency')
    .action((currency: string, addressId?: string) => handle(getPrivateClient().get_address(currency, addressId)));

  // Cross-border payments (remittances)
  const remittance = program.command('remittance').description('Cross-border payment management');

  remittance
    .command('quote')
    .description('Quote a new remittance')
    .requiredOption('--origin-currency <currency>', 'Origin currency')
    .requiredOption('--destination-currency <currency>', 'Destination currency')
    .option('--origin-amount <amount>', 'Origin amount')
    .option('--destination-amount <amount>', 'Destination amount')
    .option('--client-reference-id <id>', 'Client reference ID')
    .option('--recipient-data <json>', 'Recipient data as JSON string')
    .action((opts: {
      originCurrency: string;
      destinationCurrency: string;
      originAmount?: string;
      destinationAmount?: string;
      clientReferenceId?: string;
      recipientData?: string;
    }) => {
      handle(getPrivateClient().quote_remittance({
        origin_currency: opts.originCurrency,
        destination_currency: opts.destinationCurrency,
        origin_amount: opts.originAmount ? parseFloat(opts.originAmount) : undefined,
        destination_amount: opts.destinationAmount ? parseFloat(opts.destinationAmount) : undefined,
        client_reference_id: opts.clientReferenceId,
        recipient_data: opts.recipientData ? JSON.parse(opts.recipientData) : undefined,
      }));
    });

  remittance
    .command('accept <id>')
    .description('Accept a quoted remittance')
    .action((id: string) => handle(getPrivateClient().accept_remittance(id)));

  remittance
    .command('get <id>')
    .description('Get remittance details')
    .action((id: string) => handle(getPrivateClient().remittance(id)));

  remittance
    .command('list')
    .description('List remittances')
    .option('-p, --per <per>', 'Results per page')
    .option('--page <page>', 'Page number')
    .action((opts: { per?: string; page?: string }) => {
      handle(getPrivateClient().remittances(opts.per, opts.page));
    });

  remittance
    .command('recipients')
    .description('List remittance recipients')
    .option('-p, --per <per>', 'Results per page')
    .option('--page <page>', 'Page number')
    .action((opts: { per?: string; page?: string }) => {
      handle(getPrivateClient().remittance_recipients(opts.per, opts.page));
    });

  remittance
    .command('recipient <id>')
    .description('Get remittance recipient details')
    .action((id: string) => handle(getPrivateClient().remittance_recipient(id)));
}
