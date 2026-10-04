const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//routers- json midddleware ke baad
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/admin", adminRoutes);

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "AI Phishing Detection API is running",
  });
});

// Test Supabase connection
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Supabase database connected successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
