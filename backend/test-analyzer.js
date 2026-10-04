// backend/test-analyzer.js
const { analyzeUrl } = require("./services/urlAnalyzer");
const { calculateRisk } = require("./services/riskEngine");

const testUrls = [
  "https://www.google.com",
  "https://github.com/login",
  "http://secure-paypal-login-free.com",
  "http://192.168.1.1/login",
  "https://bit.ly/xyz123",
  "http://apple-verify-account.tk/login/update",
  "http://update-your-bank-account-now.xyz/verify",
  "not a valid url !!!",
];

testUrls.forEach((url) => {
  console.log("\n═══════════════════════════════════════════════");
  console.log("URL:", url);

  const analysis = analyzeUrl(url);
  const risk = calculateRisk(analysis);

  console.log(`${risk.emoji}  Risk Score: ${risk.riskScore}/100`);
  console.log(`     Level   : ${risk.riskLevel}`);
  console.log(`     Advice  : ${risk.recommendation}`);

  if (risk.triggeredChecks && risk.triggeredChecks.length) {
    console.log("     Reasons :");
    risk.triggeredChecks.forEach((c) => {
      console.log(`        - [${c.weight}pts] ${c.message}`);
    });
  }
});
