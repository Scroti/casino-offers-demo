/**
 * Utility to get payment method logo URLs based on payment method name
 * Uses various CDN sources for payment method logos
 */

// Using SimpleIcons CDN for all payment method logos
const SIMPLEICONS_BASE = 'https://cdn.simpleicons.org';

const PAYMENT_METHOD_LOGOS: Record<string, string> = {
  // Credit/Debit Cards
  visa: 'https://cdn.simpleicons.org/visa/142787',
  mastercard: 'https://cdn.simpleicons.org/mastercard/EB001B',
  'master card': 'https://cdn.simpleicons.org/mastercard/EB001B',
  amex: 'https://cdn.simpleicons.org/americanexpress/2E77BC',
  'american express': 'https://cdn.simpleicons.org/americanexpress/2E77BC',
  discover: 'https://cdn.simpleicons.org/discover/FF6000',
  maestro: 'https://cdn.simpleicons.org/maestro/0A0E95',
  diners: 'https://cdn.simpleicons.org/dinersclub/013087',
  'diners club': 'https://cdn.simpleicons.org/dinersclub/013087',
  jcb: 'https://cdn.simpleicons.org/jcb/0B4EA2',
  
  // E-wallets & Payment Services
  paypal: 'https://cdn.simpleicons.org/paypal/00457C',
  skrill: 'https://cdn.simpleicons.org/skrill/890403',
  neteller: 'https://cdn.simpleicons.org/neteller/6BAA39',
  paysafecard: 'https://cdn.simpleicons.org/paysafecard/000000',
  'paysafe card': 'https://cdn.simpleicons.org/paysafecard/000000',
  ecopayz: 'https://cdn.simpleicons.org/ecopayz/FFCC00',
  'eco payz': 'https://cdn.simpleicons.org/ecopayz/FFCC00',
  payz: 'https://cdn.simpleicons.org/payz/FF6600',
  muchbetter: 'https://cdn.simpleicons.org/muchbetter/007EFF',
  'much better': 'https://cdn.simpleicons.org/muchbetter/007EFF',
  trustly: 'https://cdn.simpleicons.org/trustly/0A2342',
  sofort: 'https://cdn.simpleicons.org/sofort/009B3A',
  giropay: 'https://cdn.simpleicons.org/giropay/00A551',
  ideal: 'https://cdn.simpleicons.org/ideal/C62828',
  astropay: 'https://cdn.simpleicons.org/astropay/E14226',
  'astro pay': 'https://cdn.simpleicons.org/astropay/E14226',
  payop: 'https://cdn.simpleicons.org/payop/4B0082',
  'pay op': 'https://cdn.simpleicons.org/payop/4B0082',
  sticpay: 'https://cdn.simpleicons.org/sticpay/00AEEF',
  'stic pay': 'https://cdn.simpleicons.org/sticpay/00AEEF',
  jeton: 'https://cdn.simpleicons.org/jeton/0052FF',
  perfectmoney: 'https://cdn.simpleicons.org/perfectmoney/00457C',
  'perfect money': 'https://cdn.simpleicons.org/perfectmoney/00457C',
  
  // Cryptocurrencies
  bitcoin: 'https://cdn.simpleicons.org/bitcoin/F7931A',
  btc: 'https://cdn.simpleicons.org/bitcoin/F7931A',
  ethereum: 'https://cdn.simpleicons.org/ethereum/627EEA',
  eth: 'https://cdn.simpleicons.org/ethereum/627EEA',
  litecoin: 'https://cdn.simpleicons.org/litecoin/345D9D',
  ltc: 'https://cdn.simpleicons.org/litecoin/345D9D',
  tether: 'https://cdn.simpleicons.org/tether/26A17B',
  usdt: 'https://cdn.simpleicons.org/tether/26A17B',
  usdc: 'https://cdn.simpleicons.org/usdcircle/2775CA',
  'usd coin': 'https://cdn.simpleicons.org/usdcircle/2775CA',
  dogecoin: 'https://cdn.simpleicons.org/dogecoin/C2A633',
  doge: 'https://cdn.simpleicons.org/dogecoin/C2A633',
  ripple: 'https://cdn.simpleicons.org/ripple/0085C0',
  xrp: 'https://cdn.simpleicons.org/ripple/0085C0',
  cardano: 'https://cdn.simpleicons.org/cardano/0033AD',
  ada: 'https://cdn.simpleicons.org/cardano/0033AD',
  solana: 'https://cdn.simpleicons.org/solana/9945FF',
  sol: 'https://cdn.simpleicons.org/solana/9945FF',
  binancecoin: 'https://cdn.simpleicons.org/binance/F3BA2F',
  bnb: 'https://cdn.simpleicons.org/binance/F3BA2F',
  'binance coin': 'https://cdn.simpleicons.org/binance/F3BA2F',
  
  // Prepaid Cards & Vouchers
  neosurf: 'https://cdn.simpleicons.org/neosurf/00A651',
  flexepin: 'https://cdn.simpleicons.org/flexepin/00A651',
  'flexe pin': 'https://cdn.simpleicons.org/flexepin/00A651',
  paysafecard: 'https://cdn.simpleicons.org/paysafecard/000000',
  'paysafe card': 'https://cdn.simpleicons.org/paysafecard/000000',
  entropay: 'https://cdn.simpleicons.org/entropay/00A651',
  'entro pay': 'https://cdn.simpleicons.org/entropay/00A651',
  
  // Bank Transfers & Direct Banking
  banktransfer: 'https://via.placeholder.com/64/003366/FFFFFF?text=Bank',
  'bank transfer': 'https://via.placeholder.com/64/003366/FFFFFF?text=Bank',
  wiretransfer: 'https://via.placeholder.com/64/003366/FFFFFF?text=Wire',
  'wire transfer': 'https://via.placeholder.com/64/003366/FFFFFF?text=Wire',
  sepa: 'https://via.placeholder.com/64/003366/FFFFFF?text=SEPA',
  'sepa transfer': 'https://via.placeholder.com/64/003366/FFFFFF?text=SEPA',
  poli: 'https://cdn.simpleicons.org/poli/00A651',
  klarna: 'https://cdn.simpleicons.org/klarna/FFB3C7',
  
  // Online Banking (Europe)
  ideal: 'https://cdn.simpleicons.org/ideal/C62828',
  sofort: 'https://cdn.simpleicons.org/sofort/009B3A',
  giropay: 'https://cdn.simpleicons.org/giropay/00A551',
  eps: 'https://cdn.simpleicons.org/eps/009B3A',
  bancontact: 'https://cdn.simpleicons.org/bancontact/00A651',
  
  // Banks (European/UK/International)
  nordea: 'https://cdn.simpleicons.org/nordea/00A651',
  swedbank: 'https://cdn.simpleicons.org/swedbank/004C97',
  santander: 'https://cdn.simpleicons.org/santander/EC0000',
  multibanco: 'https://cdn.simpleicons.org/multibanco/0066CC',
  bbva: 'https://cdn.simpleicons.org/bbva/004481',
  ing: 'https://cdn.simpleicons.org/ingbank/FF6200',
  deutschebank: 'https://cdn.simpleicons.org/deutschebank/0018A8',
  'deutsche bank': 'https://cdn.simpleicons.org/deutschebank/0018A8',
  barclays: 'https://cdn.simpleicons.org/barclays/00AEEF',
  hsbc: 'https://cdn.simpleicons.org/hsbc/DB0011',
  natwest: 'https://cdn.simpleicons.org/natwest/D71F2A',
  'nat west': 'https://cdn.simpleicons.org/natwest/D71F2A',
  
  // Mobile Payments
  applepay: 'https://cdn.simpleicons.org/applepay/000000',
  'apple pay': 'https://cdn.simpleicons.org/applepay/000000',
  googlepay: 'https://cdn.simpleicons.org/googlepay/4285F4',
  'google pay': 'https://cdn.simpleicons.org/googlepay/4285F4',
  samsungpay: 'https://cdn.simpleicons.org/samsungpay/1428A0',
  'samsung pay': 'https://cdn.simpleicons.org/samsungpay/1428A0',
};

/**
 * Get payment method logo URL based on payment name
 * Returns empty string if not found (will show text instead)
 */
export function getPaymentLogo(paymentName: string): string {
  if (!paymentName) return '';
  
  // Normalize the name: lowercase, trim, remove special chars
  const normalized = paymentName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
  
  // Check exact match first
  if (PAYMENT_METHOD_LOGOS[normalized]) {
    return PAYMENT_METHOD_LOGOS[normalized];
  }
  
  // Check for partial matches (e.g., "Visa Card" -> "visa")
  for (const [key, url] of Object.entries(PAYMENT_METHOD_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized.split(' ')[0])) {
      return url;
    }
  }
  
  // Fallback: return empty string to show text instead of placeholder
  return '';
}

/**
 * Check if a payment method has a known logo
 */
export function hasPaymentLogo(paymentName: string): boolean {
  const normalized = paymentName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
  
  if (PAYMENT_METHOD_LOGOS[normalized]) return true;
  
  for (const key of Object.keys(PAYMENT_METHOD_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized.split(' ')[0])) {
      return true;
    }
  }
  
  return false;
}

