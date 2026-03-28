# buda-cli

Command-line interface for the [buda.com](https://www.buda.com) cryptocurrency exchange, built with TypeScript and Commander.js.

## Installation

```sh
npm install -g buda-cli
```

Or use it without installing via npx:

```sh
npx buda-cli <command>
```

## Setup

Run `buda init` to configure your API credentials. You can create API keys at [buda.com/manejar_api_keys](https://www.buda.com/manejar_api_keys).

```sh
buda init
```

Credentials are saved to a `.env` file in your current directory.

## Commands

### Public (no credentials required)

| Command | Description |
|---|---|
| `buda markets` | List all available markets |
| `buda ticker <market>` | Get ticker for a market |
| `buda orderbook <market>` | Get the order book for a market |
| `buda trades <market>` | Get recent trades for a market |
| `buda volume <market>` | Get traded volume for a market |
| `buda fees <currency> <type>` | Get fees (`type`: `deposit` or `withdrawal`) |

### Private (requires API credentials)

| Command | Description |
|---|---|
| `buda balance [currency]` | Get account balance (all currencies if omitted) |
| `buda orders <market>` | List orders for a market |
| `buda order new <market> <type> <price-type> <limit> <amount>` | Create a new order |
| `buda me` | Get current user information |
| `buda quotation <market> <type> <amount>` | Get a price quotation |
| `buda order cancel <id>` | Cancel an order |
| `buda order cancel-all <market> <type>` | Cancel all orders for a market and type |
| `buda order get <id>` | Get a single order |
| `buda order batch <json>` | Create multiple orders in a batch |
| `buda deposits <currency>` | List deposits for a currency |
| `buda withdrawals <currency>` | List withdrawals for a currency |
| `buda withdraw <currency> <amount> <address>` | Withdraw crypto to an address |
| `buda lightning-withdraw <amount> <invoice>` | Withdraw via Lightning Network |
| `buda lightning-invoice <amount> <currency>` | Create a Lightning Network invoice |
| `buda fiat-deposit <currency> <amount>` | Initiate a fiat deposit |
| `buda address new <currency>` | Create a new deposit address |

### Examples

```sh
buda ticker btc-clp
buda orderbook eth-clp
buda balance
buda balance btc
buda orders btc-clp
buda order new btc-clp bid limit 50000000 0.001
buda order cancel 12345
```

## Development

```sh
npm install
npm run dev -- <command>   # run without building
npm run build              # compile TypeScript
```

## Related

- [buda-promise](https://www.npmjs.com/package/buda-promise) — the underlying Node.js API wrapper this CLI is built on

## License

MIT
