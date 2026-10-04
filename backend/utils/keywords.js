// backend/utils/keywords.js

/**
 * Suspicious keywords commonly found in phishing URLs
 */
const SUSPICIOUS_KEYWORDS = [
  // Auth / credential related
  "login",
  "signin",
  "sign-in",
  "verify",
  "verification",
  "account",
  "update",
  "confirm",
  "secure",
  "security",
  "password",
  "credential",
  "auth",
  "validate",

  // Financial / banking
  "bank",
  "paypal",
  "paytm",
  "upi",
  "netbanking",
  "wallet",
  "payment",
  "billing",
  "invoice",
  "refund",

  // Urgency / bait
  "free",
  "gift",
  "prize",
  "winner",
  "reward",
  "bonus",
  "urgent",
  "alert",
  "warning",
  "suspended",
  "locked",
  "expire",
  "limited",
  "offer",
  "claim",

  // Common brand impersonation (lowercased)
  "apple",
  "microsoft",
  "google",
  "amazon",
  "facebook",
  "instagram",
  "whatsapp",
  "netflix",
  "flipkart",
];

/**
 * Suspicious top-level domains often used by attackers
 * (cheap or free TLDs)
 */
const SUSPICIOUS_TLDS = [
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq", // Freenom free TLDs
  ".xyz",
  ".top",
  ".work",
  ".click",
  ".link",
  ".loan",
  ".download",
  ".review",
  ".country",
  ".stream",
  ".science",
];

/**
 * Known URL shorteners — not always malicious,
 * but hide the real destination
 */
const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "t.co",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "rebrand.ly",
  "cutt.ly",
  "shorturl.at",
  "rb.gy",
];

/**
 * Risky file extensions often used to deliver malware
 */
const RISKY_EXTENSIONS = [
  ".exe",
  ".apk",
  ".scr",
  ".bat",
  ".cmd",
  ".msi",
  ".vbs",
  ".jar",
  ".zip",
  ".rar",
];

/**
 * Legitimate/trusted domains — always considered SAFE.
 * Match rules:
 *   - exact match: "google.com"
 *   - subdomain match: hostname ends with ".google.com"
 *   - any TLD match: if entry starts with ".", hostname ends with it (e.g. ".gov")
 */
const TRUSTED_DOMAINS = [
  // Big tech / common services
  "google.com",
  "youtube.com",
  "gmail.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "facebook.com",
  "instagram.com",
  "whatsapp.com",
  "github.com",
  "gitlab.com",
  "stackoverflow.com",
  "wikipedia.org",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "netflix.com",
  "spotify.com",
  "dropbox.com",
  "cloudflare.com",
  "mozilla.org",
  "reddit.com",

  // Payments (real ones)
  "paypal.com",
  "stripe.com",
  "razorpay.com",

  // Indian e-commerce / services
  "flipkart.com",
  "myntra.com",
  "amazon.in",
  "irctc.co.in",
  "zomato.com",
  "swiggy.com",

  // Indian banks
  "sbi.co.in",
  "onlinesbi.sbi",
  "hdfcbank.com",
  "icicibank.com",
  "axisbank.com",
  "kotak.com",

  // Government (any TLD variant)
  ".gov",
  ".gov.in",
  ".gov.uk",
  ".nic.in",
  ".mil",
];

module.exports = {
  SUSPICIOUS_KEYWORDS,
  SUSPICIOUS_TLDS,
  URL_SHORTENERS,
  RISKY_EXTENSIONS,
  TRUSTED_DOMAINS,
};
