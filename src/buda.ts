// eslint-disable-next-line @typescript-eslint/no-require-imports
const Buda = require('buda-promise');

export function getPublicClient() {
  return new Buda();
}

export function getPrivateClient() {
  const key = process.env.BUDA_API_KEY;
  const secret = process.env.BUDA_API_SECRET;
  if (!key || !secret) {
    console.error('Error: API credentials not configured. Run `buda init` to set them up.');
    process.exit(1);
  }
  return new Buda(key, secret, { timeout: 30000 });
}
