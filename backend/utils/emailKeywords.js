// backend/utils/emailKeywords.js

/**
 * Suspicious phrases commonly found in phishing emails
 */
const URGENCY_PHRASES = [
  "urgent",
  "immediately",
  "right now",
  "act now",
  "expires today",
  "limited time",
  "last chance",
  "within 24 hours",
  "account will be suspended",
  "account will be closed",
  "account will be locked",
  "verify immediately",
  "act fast",
  "don't delay",
];

const CREDENTIAL_REQUESTS = [
  "verify your account",
  "confirm your identity",
  "update your password",
  "reset your password",
  "click here to login",
  "sign in to verify",
  "confirm your password",
  "enter your credentials",
  "provide your details",
  "verify your information",
  "update your billing",
  "confirm your payment",
];

const FINANCIAL_BAIT = [
  "you have won",
  "claim your prize",
  "wire transfer",
  "bank account",
  "credit card",
  "social security",
  "tax refund",
  "inheritance",
  "lottery",
  "million dollars",
  "cash prize",
  "free gift",
  "unclaimed funds",
  "processing fee",
];

const THREATS = [
  "legal action",
  "court",
  "lawsuit",
  "police",
  "arrest",
  "penalty",
  "fine",
  "suspend",
  "terminate",
  "close your account",
  "block your account",
];

const IMPERSONATION = [
  "dear customer",
  "dear user",
  "dear valued customer",
  "microsoft support",
  "apple support",
  "google team",
  "amazon security",
  "paypal security",
  "bank of",
  "it support",
  "helpdesk",
];

const SUSPICIOUS_PHRASES = [
  ...URGENCY_PHRASES,
  ...CREDENTIAL_REQUESTS,
  ...FINANCIAL_BAIT,
  ...THREATS,
  ...IMPERSONATION,
];

module.exports = {
  URGENCY_PHRASES,
  CREDENTIAL_REQUESTS,
  FINANCIAL_BAIT,
  THREATS,
  IMPERSONATION,
  SUSPICIOUS_PHRASES,
};
