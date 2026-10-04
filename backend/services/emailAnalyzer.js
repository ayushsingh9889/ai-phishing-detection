// backend/services/emailAnalyzer.js

const {
  URGENCY_PHRASES,
  CREDENTIAL_REQUESTS,
  FINANCIAL_BAIT,
  THREATS,
  IMPERSONATION,
} = require("../utils/emailKeywords");

/**
 * Check 1: Urgency / threatening language
 */
function checkUrgency(text) {
  const lower = text.toLowerCase();
  const found = URGENCY_PHRASES.filter((p) => lower.includes(p));
  const weight = Math.min(found.length * 8, 25);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No urgency phrases detected"
        : `Urgency language: ${found.slice(0, 3).join(", ")}`,
  };
}

/**
 * Check 2: Credential requests
 */
function checkCredentialRequests(text) {
  const lower = text.toLowerCase();
  const found = CREDENTIAL_REQUESTS.filter((p) => lower.includes(p));
  const weight = Math.min(found.length * 10, 30);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No credential requests found"
        : `Requests credentials: ${found.slice(0, 3).join(", ")}`,
  };
}

/**
 * Check 3: Financial bait
 */
function checkFinancialBait(text) {
  const lower = text.toLowerCase();
  const found = FINANCIAL_BAIT.filter((p) => lower.includes(p));
  const weight = Math.min(found.length * 10, 25);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No financial bait detected"
        : `Financial bait: ${found.slice(0, 3).join(", ")}`,
  };
}

/**
 * Check 4: Threats
 */
function checkThreats(text) {
  const lower = text.toLowerCase();
  const found = THREATS.filter((p) => lower.includes(p));
  const weight = Math.min(found.length * 8, 20);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No threatening language"
        : `Threatening language: ${found.slice(0, 3).join(", ")}`,
  };
}

/**
 * Check 5: Impersonation
 */
function checkImpersonation(text) {
  const lower = text.toLowerCase();
  const found = IMPERSONATION.filter((p) => lower.includes(p));
  const weight = Math.min(found.length * 6, 15);

  return {
    passed: found.length === 0,
    weight,
    found,
    message:
      found.length === 0
        ? "No impersonation patterns"
        : `Possible impersonation: ${found.slice(0, 3).join(", ")}`,
  };
}

/**
 * Check 6: Suspicious links in email
 */
function checkLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];

  const suspiciousUrls = urls.filter((url) => {
    const lower = url.toLowerCase();
    return (
      lower.includes("bit.ly") ||
      lower.includes("tinyurl") ||
      lower.includes("goo.gl") ||
      lower.includes("t.co") ||
      lower.includes(".tk") ||
      lower.includes(".ml") ||
      lower.includes(".xyz") ||
      lower.includes(".top") ||
      /https?:\/\/\d+\.\d+\.\d+\.\d+/.test(lower)
    );
  });

  const weight = Math.min(suspiciousUrls.length * 12, 30);

  return {
    passed: suspiciousUrls.length === 0,
    weight,
    found: suspiciousUrls,
    totalUrls: urls.length,
    message:
      suspiciousUrls.length === 0
        ? urls.length > 0
          ? `${urls.length} link(s) found — none suspicious`
          : "No links in email"
        : `${suspiciousUrls.length} suspicious link(s) found`,
  };
}

/**
 * 🎯 MAIN FUNCTION
 */
function analyzeEmail(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      valid: false,
      error: "Email content is required",
    };
  }

  if (text.trim().length < 10) {
    return {
      valid: false,
      error: "Email content is too short to analyze",
    };
  }

  const checks = {
    urgency: checkUrgency(text),
    credentials: checkCredentialRequests(text),
    financialBait: checkFinancialBait(text),
    threats: checkThreats(text),
    impersonation: checkImpersonation(text),
    links: checkLinks(text),
  };

  const totalWeight = Object.values(checks).reduce(
    (sum, c) => sum + (c.weight || 0),
    0,
  );

  return {
    valid: true,
    content: text.slice(0, 200) + (text.length > 200 ? "..." : ""),
    totalWeight,
    checks,
  };
}

module.exports = { analyzeEmail };
