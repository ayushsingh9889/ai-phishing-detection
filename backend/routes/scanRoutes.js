// backend/routes/scanRoutes.js

const express = require("express");
const router = express.Router();

const {
  scanUrl,
  scanEmail,
  getScanHistory,
  getDashboardStats,
} = require("../controllers/scanController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/url", scanUrl);
router.post("/email", scanEmail); // 🆕 NEW
router.get("/history", getScanHistory);
router.get("/stats", getDashboardStats);

module.exports = router;
