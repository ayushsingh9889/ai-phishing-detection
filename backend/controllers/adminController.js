// backend/controllers/adminController.js

const supabase = require("../config/supabase");

/**
 * GET /api/admin/stats
 * System-wide statistics
 */
async function getAdminStats(req, res) {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Total scans
    const { count: totalScans } = await supabase
      .from("scan_history")
      .select("*", { count: "exact", head: true });

    // All scans for breakdown
    const { data: scans } = await supabase
      .from("scan_history")
      .select("risk_level, scan_type");

    const high = scans?.filter((s) => s.risk_level === "HIGH").length || 0;
    const medium = scans?.filter((s) => s.risk_level === "MEDIUM").length || 0;
    const low = scans?.filter((s) => s.risk_level === "LOW").length || 0;
    const urlScans = scans?.filter((s) => s.scan_type === "URL").length || 0;
    const emailScans =
      scans?.filter((s) => s.scan_type === "EMAIL").length || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalScans: totalScans || 0,
        high,
        medium,
        low,
        urlScans,
        emailScans,
      },
    });
  } catch (err) {
    console.error("getAdminStats error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * GET /api/admin/users
 * List all users (without passwords)
 */
async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("getAllUsers error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * GET /api/admin/logs
 * All scan logs from all users
 */
async function getAllLogs(req, res) {
  try {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("getAllLogs error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch logs",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("getAllLogs error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * PATCH /api/admin/users/:id/role
 * Update user role (USER <-> ADMIN)
 */
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select("id, name, email, role")
      .single();

    if (error) {
      console.error("updateUserRole error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update role",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data,
    });
  } catch (err) {
    console.error("updateUserRole error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllLogs,
  updateUserRole,
};
