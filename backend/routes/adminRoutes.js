// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  getAllLogs,
  updateUserRole,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/logs", getAllLogs);
router.patch("/users/:id/role", updateUserRole);

module.exports = router;
