// backend/services/virusTotalService.js

const axios = require("axios");

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_BASE_URL = "https://www.virustotal.com/api/v3";

/**
 * Check a URL on VirusTotal.
 * Returns { available, malicious, suspicious, harmless, undetected, total, found }
 */
async function checkVirusTotal(url) {
  if (!VT_API_KEY) {
    return {
      available: false,
      message: "VirusTotal API key not configured",
    };
  }

  try {
    // Step 1: Convert URL to VirusTotal's expected ID format
    const urlId = Buffer.from(url)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // Step 2: Fetch report
    const response = await axios.get(`${VT_BASE_URL}/urls/${urlId}`, {
      headers: { "x-apikey": VT_API_KEY },
      timeout: 10000,
    });

    const stats = response.data?.data?.attributes?.last_analysis_stats || {};

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;

    return {
      available: true,
      malicious,
      suspicious,
      harmless,
      undetected,
      total,
      found: malicious + suspicious > 0,
    };
  } catch (err) {
    // 404 = URL not yet in VT database (new URL)
    if (err.response?.status === 404) {
      return {
        available: true,
        malicious: 0,
        suspicious: 0,
        harmless: 0,
        undetected: 0,
        total: 0,
        found: false,
        message: "URL not yet in VirusTotal database",
      };
    }

    console.error("VirusTotal error:", err.message);
    return {
      available: false,
      message: `VirusTotal check failed: ${err.message}`,
    };
  }
}

module.exports = { checkVirusTotal };
