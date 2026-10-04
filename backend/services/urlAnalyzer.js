// backend/services/urlAnalyzer.js

const {
  SUSPICIOUS_KEYWORDS,
  SUSPICIOUS_TLDS,
  URL_SHORTENERS,
  RISKY_EXTENSIONS,
  TRUSTED_DOMAINS,
} = require("../utils/keywords");

/**
 * Safely parse a URL. Returns null if invalid.
 */
function parseUrl(rawUrl) {
  try {
    let url = String(rawUrl).trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return new URL(url);
  } catch (err) {
    return null;
  }
}

/**
 * Check if hostname matches any trusted domain entry.
 */
function isTrustedHost(hostname) {
  const host = hostname.toLowerCase();
  return TRUSTED_DOMAINS.some((entry) => {
    const domain = entry.toLowerCase();
    if (domain.startsWith(".")) {
      // TLD-style entry: ".gov", ".gov.in"
      return host === domain.slice(1) || host.endsWith(domain);
    }
    return host === domain || host.endsWith("." + domain);
  });
}

/* ------------------------------------------------------------------ */
/*  Individual checks                                                  */
/* ------------------------------------------------------------------ */

function checkHttps(parsed) {
  const isHttps = parsed.protocol === "https:";
  return {
    passed: isHttps,
    weight: isHttps ? 0 : 20,
    message: isHttps
      ? "Uses HTTPS (secure connection)"
      : "Does NOT use HTTPS (insecure connection)",
  };
}

function checkKeywords(parsed) {
  const urlLower = parsed.href.toLowerCase();
  const found = SUSPICIOUS_KEYWORDS.filter((kw) => urlLower.includes(kw));

  const weight = Math.min(found.length * 8, 20);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No suspicious keywords found"
        : `Contains suspicious keywords: ${found.join(", ")}`,
  };
}

function checkLength(parsed) {
  const length = parsed.href.length;
  let weight = 0;
  let message = "URL length is normal";

  if (length > 100) {
    weight = 15;
    message = `URL is very long (${length} chars) — suspicious`;
  } else if (length > 75) {
    weight = 8;
    message = `URL is long (${length} chars)`;
  }

  return { passed: weight === 0, weight, length, message };
}

function checkSubdomains(parsed) {
  const hostname = parsed.hostname;

  // Skip for IP addresses
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return {
      passed: true,
      weight: 0,
      subdomainCount: 0,
      message: "IP-based host — subdomain check skipped",
    };
  }

  const parts = hostname.split(".");
  const subdomainCount = Math.max(parts.length - 2, 0);

  let weight = 0;
  let message = "Subdomain structure looks normal";

  if (subdomainCount >= 4) {
    weight = 20;
    message = `Too many subdomains (${subdomainCount}) — possible phishing`;
  } else if (subdomainCount >= 3) {
    weight = 12;
    message = `Multiple subdomains (${subdomainCount})`;
  } else if (subdomainCount === 2) {
    weight = 5;
    message = `Two subdomains detected`;
  }

  return { passed: weight === 0, weight, subdomainCount, message };
}

function checkIpAddress(parsed) {
  const hostname = parsed.hostname;
  const isIp =
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(":");

  return {
    passed: !isIp,
    weight: isIp ? 25 : 0,
    message: isIp
      ? "Uses raw IP address instead of a domain — highly suspicious"
      : "Uses a domain name",
  };
}

function checkTld(parsed) {
  const hostname = parsed.hostname.toLowerCase();
  const matched = SUSPICIOUS_TLDS.find((tld) => hostname.endsWith(tld));

  return {
    passed: !matched,
    weight: matched ? 15 : 0,
    tld: matched || null,
    message: matched ? `Suspicious TLD detected: ${matched}` : "TLD looks fine",
  };
}

function checkShortenerAndExtension(parsed) {
  const hrefLower = parsed.href.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();

  const shortener = URL_SHORTENERS.find((s) => hostname.includes(s));
  const riskyExt = RISKY_EXTENSIONS.find((e) => hrefLower.endsWith(e));

  let weight = 0;
  const issues = [];

  if (shortener) {
    weight += 10;
    issues.push(`URL shortener detected (${shortener})`);
  }
  if (riskyExt) {
    weight += 20;
    issues.push(`Risky file extension (${riskyExt})`);
  }

  return {
    passed: weight === 0,
    weight,
    message: issues.length
      ? issues.join(" | ")
      : "No shortener or risky extension",
  };
}

/* ------------------------------------------------------------------ */
/*  🎯 MAIN                                                           */
/* ------------------------------------------------------------------ */

function analyzeUrl(rawUrl) {
  const parsed = parseUrl(rawUrl);

  if (!parsed) {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // ✅ Trusted whitelist short-circuit
  if (isTrustedHost(hostname)) {
    return {
      valid: true,
      trusted: true,
      url: parsed.href,
      hostname: parsed.hostname,
      protocol: parsed.protocol,
      totalWeight: 0,
      checks: {
        whitelist: {
          passed: true,
          weight: 0,
          message: "Domain is in trusted list — marked safe",
        },
      },
    };
  }

  const checks = {
    https: checkHttps(parsed),
    keywords: checkKeywords(parsed),
    length: checkLength(parsed),
    subdomains: checkSubdomains(parsed),
    ipAddress: checkIpAddress(parsed),
    tld: checkTld(parsed),
    shortenerAndExt: checkShortenerAndExtension(parsed),
  };

  const totalWeight = Object.values(checks).reduce(
    (sum, c) => sum + (c.weight || 0),
    0,
  );

  return {
    valid: true,
    trusted: false,
    url: parsed.href,
    hostname: parsed.hostname,
    protocol: parsed.protocol,
    totalWeight,
    checks,
  };
}

module.exports = { analyzeUrl };
