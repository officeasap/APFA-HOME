export type DonationMethod = "fiat" | "crypto";

export type CryptoNetwork =
  | "Ethereum"
  | "Bitcoin"
  | "Solana"
  | "TRON"
  | "Arbitrum"
  | "BNB Smart Chain";

export type CryptoWalletPresentation = {
  id: string;
  asset: string;
  network: CryptoNetwork;
  standard: string;
  qrImage: string;
};

export const CRYPTO_WALLETS: CryptoWalletPresentation[] = [
  {
    id: "ethereum",
    asset: "ETH",
    network: "Ethereum",
    standard: "ERC-20",
    qrImage: "/donations/qr/ethereum.png",
  },
  {
    id: "bitcoin",
    asset: "BTC",
    network: "Bitcoin",
    standard: "Bitcoin",
    qrImage: "/donations/qr/bitcoin.png",
  },
  {
    id: "solana",
    asset: "SOL",
    network: "Solana",
    standard: "Solana",
    qrImage: "/donations/qr/solana.png",
  },
  {
    id: "tron",
    asset: "TRX / USDT",
    network: "TRON",
    standard: "TRC-20",
    qrImage: "/donations/qr/tron.png",
  },
  {
    id: "arbitrum",
    asset: "ETH",
    network: "Arbitrum",
    standard: "Arbitrum One",
    qrImage: "/donations/qr/arbitrum.png",
  },
  {
    id: "bnb-smart-chain",
    asset: "BNB / BEP-20",
    network: "BNB Smart Chain",
    standard: "BEP-20",
    qrImage: "/donations/qr/bnb-smart-chain.png",
  },
];

export const FIAT_CURRENCIES = ["NGN", "USD", "EUR", "GBP"] as const;

export type FiatCurrency = (typeof FIAT_CURRENCIES)[number];
