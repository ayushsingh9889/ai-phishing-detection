// backend/controllers/scanController.js
// backend/controllers/scanController.js

const { analyzeUrl } = require("../services/urlAnalyzer");
const { analyzeEmail } = require("../services/emailAnalyzer");
const { calculateRisk, calculateEmailRisk } = require("../services/riskEngine");
const { checkVirusTotal } = require("../services/virusTotalService");
const supabase = require("../config/supabase");

async function scanUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // 1. Rule-based analysis
    const analysis = analyzeUrl(url);

    if (!analysis.valid) {
      return res.status(400).json({
        success: false,
        message: analysis.error || "Invalid URL",
      });
    }

    // 2. Call VirusTotal (skip for trusted domains)
    let apiResults = {};
    if (!analysis.trusted) {
      const virusTotal = await checkVirusTotal(analysis.url);
      apiResults = { virusTotal };
    }

    // 3. Calculate risk (includes API results)
    const risk = calculateRisk(analysis, apiResults);

    // 4. Save to Supabase
    const { data: savedScan, error: dbError } = await supabase
      .from("scan_history")
      .insert({
        user_id: req.user.id,
        scan_type: "URL",
        content: analysis.url,
        result: JSON.stringify(risk),
        risk_score: risk.riskScore,
        risk_level: risk.riskLevel,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    // 5. Return response
    return res.status(200).json({
      success: true,
      message: "URL scanned successfully",
      data: {
        scanId: savedScan?.id || null,
        url: risk.url,
        hostname: risk.hostname,
        protocol: risk.protocol,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        color: risk.color,
        emoji: risk.emoji,
        recommendation: risk.recommendation,
        triggeredChecks: risk.triggeredChecks,
        trusted: risk.trusted || false,
        apiResults: risk.apiResults || null,
      },
    });
  } catch (err) {
    console.error("scanUrl error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while scanning URL",
      error: err.message,
    });
  }
}

async function getScanHistory(req, res) {
  try {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("History fetch error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch scan history",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("getScanHistory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
async function scanEmail(req, res) {
  try {
    const { content } = req.body;

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Email content is required",
      });
    }

    // 1. Analyze email
    const analysis = analyzeEmail(content);

    if (!analysis.valid) {
      return res.status(400).json({
        success: false,
        message: analysis.error || "Invalid email content",
      });
    }

    // 2. Calculate risk
    const risk = calculateEmailRisk(analysis);

    // 3. Save to Supabase
    const { data: savedScan, error: dbError } = await supabase
      .from("scan_history")
      .insert({
        user_id: req.user.id,
        scan_type: "EMAIL",
        content: analysis.content,
        result: JSON.stringify(risk),
        risk_score: risk.riskScore,
        risk_level: risk.riskLevel,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    // 4. Return response
    return res.status(200).json({
      success: true,
      message: "Email analyzed successfully",
      data: {
        scanId: savedScan?.id || null,
        content: risk.content,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        color: risk.color,
        emoji: risk.emoji,
        recommendation: risk.recommendation,
        triggeredChecks: risk.triggeredChecks,
      },
    });
  } catch (err) {
    console.error("scanEmail error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while analyzing email",
      error: err.message,
    });
  }
}

/**
 * GET /api/scan/stats
 * Returns dashboard statistics for the logged-in user
 */
async function getDashboardStats(req, res) {
  try {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) {
      console.error("Stats fetch error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch stats",
      });
    }

    const total = data.length;
    const high = data.filter((s) => s.risk_level === "HIGH").length;
    const medium = data.filter((s) => s.risk_level === "MEDIUM").length;
    const low = data.filter((s) => s.risk_level === "LOW").length;
    const urlScans = data.filter((s) => s.scan_type === "URL").length;
    const emailScans = data.filter((s) => s.scan_type === "EMAIL").length;

    // Average risk score
    const avgScore =
      total > 0
        ? Math.round(
            data.reduce((sum, s) => sum + (s.risk_score || 0), 0) / total,
          )
        : 0;

    // Last 7 days trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayScans = data.filter(
        (s) => s.created_at && s.created_at.split("T")[0] === dateStr,
      );

      last7Days.push({
        date: dateStr,
        label: date.toLocaleDateString("en-IN", { weekday: "short" }),
        total: dayScans.length,
        high: dayScans.filter((s) => s.risk_level === "HIGH").length,
        medium: dayScans.filter((s) => s.risk_level === "MEDIUM").length,
        low: dayScans.filter((s) => s.risk_level === "LOW").length,
      });
    }

    // Recent 5 scans
    const recent = [...data]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        scan_type: s.scan_type,
        content: s.content.slice(0, 60) + (s.content.length > 60 ? "..." : ""),
        risk_level: s.risk_level,
        risk_score: s.risk_score,
        created_at: s.created_at,
      }));

    return res.status(200).json({
      success: true,
      data: {
        total,
        high,
        medium,
        low,
        urlScans,
        emailScans,
        avgScore,
        last7Days,
        recent,
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = { scanUrl, scanEmail, getScanHistory, getDashboardStats };
