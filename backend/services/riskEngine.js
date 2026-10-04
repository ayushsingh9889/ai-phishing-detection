// backend/services/riskEngine.js

/**
 * Risk Engine
 * Converts raw totalWeight from URL analysis
 * into a user-friendly risk score + level + recommendation.
 */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRiskLevel(score) {
  if (score >= 71) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

function getRiskColor(level) {
  switch (level) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "yellow";
    case "LOW":
      return "green";
    default:
      return "gray";
  }
}

function getRiskEmoji(level) {
  switch (level) {
    case "HIGH":
      return "🔴";
    case "MEDIUM":
      return "🟡";
    case "LOW":
      return "🟢";
    default:
      return "⚪";
  }
}

function getRecommendation(level) {
  switch (level) {
    case "HIGH":
      return "⚠️ Do NOT visit this website. It shows strong phishing indicators.";
    case "MEDIUM":
      return "⚠️ Be cautious. This URL has some suspicious characteristics. Verify the source before visiting.";
    case "LOW":
      return "✅ This URL looks safe. Still, always be careful when entering personal information.";
    default:
      return "Unable to determine safety.";
  }
}

function getTriggeredChecks(checks) {
  const triggered = [];

  Object.entries(checks).forEach(([key, check]) => {
    if (!check.passed) {
      triggered.push({
        check: key,
        weight: check.weight,
        message: check.message,
        found: check.found || null,
        tld: check.tld || null,
        subdomainCount: check.subdomainCount || null,
        length: check.length || null,
      });
    }
  });

  triggered.sort((a, b) => b.weight - a.weight);
  return triggered;
}

/**
 * 🎯 MAIN FUNCTION
 * @param {Object} analysis - Output from urlAnalyzer.analyzeUrl()
 * @param {Object} apiResults - Output from external APIs (VirusTotal, etc.)
 */
function calculateRisk(analysis, apiResults = {}) {
  // Handle invalid URL
  if (!analysis || !analysis.valid) {
    return {
      valid: false,
      error: analysis?.error || "Invalid URL",
      riskScore: 0,
      riskLevel: "UNKNOWN",
      recommendation: "Please provide a valid URL.",
      color: "gray",
      emoji: "⚪",
      triggeredChecks: [],
    };
  }

  // Trusted whitelist shortcut
  if (analysis.trusted) {
    return {
      valid: true,
      trusted: true,
      url: analysis.url,
      hostname: analysis.hostname,
      protocol: analysis.protocol,
      riskScore: 0,
      riskLevel: "LOW",
      color: "green",
      emoji: "🟢",
      recommendation: "✅ This is a trusted, well-known website.",
      triggeredChecks: [],
      checks: analysis.checks,
    };
  }

  // API weights
  let apiWeight = 0;
  const apiChecks = [];

  // VirusTotal
  if (apiResults.virusTotal?.available && apiResults.virusTotal.found) {
    const vtWeight = Math.min(apiResults.virusTotal.malicious * 10, 40);
    apiWeight += vtWeight;
    apiChecks.push({
      check: "virusTotal",
      weight: vtWeight,
      message: `VirusTotal: ${apiResults.virusTotal.malicious} engines flagged as malicious, ${apiResults.virusTotal.suspicious} suspicious`,
    });
  }

  // Combine local + API weights
  const combinedWeight = analysis.totalWeight + apiWeight;
  const riskScore = clamp(Math.round(combinedWeight), 0, 100);

  const riskLevel = getRiskLevel(riskScore);
  const color = getRiskColor(riskLevel);
  const emoji = getRiskEmoji(riskLevel);
  const recommendation = getRecommendation(riskLevel);

  const localTriggered = getTriggeredChecks(analysis.checks);
  const triggeredChecks = [...apiChecks, ...localTriggered].sort(
    (a, b) => b.weight - a.weight,
  );

  return {
    valid: true,
    trusted: false,
    url: analysis.url,
    hostname: analysis.hostname,
    protocol: analysis.protocol,
    riskScore,
    riskLevel,
    color,
    emoji,
    recommendation,
    triggeredChecks,
    checks: analysis.checks,
    apiResults,
  };
}

/**
 * Calculate risk for email analysis
 */
function calculateEmailRisk(analysis) {
  if (!analysis || !analysis.valid) {
    return {
      valid: false,
      error: analysis?.error || "Invalid email content",
      riskScore: 0,
      riskLevel: "UNKNOWN",
      recommendation: "Please provide valid email content.",
      color: "gray",
      emoji: "⚪",
      triggeredChecks: [],
    };
  }

  const riskScore = clamp(Math.round(analysis.totalWeight), 0, 100);
  const riskLevel = getRiskLevel(riskScore);
  const color = getRiskColor(riskLevel);
  const emoji = getRiskEmoji(riskLevel);
  const recommendation = getRecommendation(riskLevel);
  const triggeredChecks = getTriggeredChecks(analysis.checks);

  return {
    valid: true,
    content: analysis.content,
    riskScore,
    riskLevel,
    color,
    emoji,
    recommendation,
    triggeredChecks,
    checks: analysis.checks,
  };
}

module.exports = { calculateRisk, calculateEmailRisk };
