require("dotenv").config();

const express = require("express");
const { API_PREFIX } = require("./src/constants");
const { sendSuccess } = require("./src/utils/response");
const { connectDB } = require("./src/config/database");

// Import routes
const authRoutes = require("./src/routes/auth");
const provinceRoutes = require("./src/routes/provinces");
const districtRoutes = require("./src/routes/districts");
const policeStationRoutes = require("./src/routes/police-stations");
const vehicleRoutes = require("./src/routes/vehicles");
const driverRoutes = require("./src/routes/drivers");
const locationRoutes = require("./src/routes/locations");

// Import middleware
const { verifyTokenMiddleware } = require("./src/middleware/auth");

// Import swagger config
const { setupSwagger } = require("./src/config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== DATABASE CONNECTION ====================
const dbPromise = connectDB();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all origins — must be FIRST so OPTIONS preflight
// responds immediately without waiting for the database connection.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Ensure database is connected before proceeding to route handlers
app.use(async (req, res, next) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      await dbPromise; // Wait for the initial connection promise
      if (mongoose.connection.readyState !== 1) {
        const { connectDB } = require("./src/config/database");
        await connectDB();
      }
    }
    next();
  } catch (error) {
    console.error("Database connection middleware error:", error);
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Swagger API Documentation
setupSwagger(app, API_PREFIX);

// Health check / API info route (no auth required)
app.get("/", (req, res) => {
  sendSuccess(
    res,
    {
      api: "Tuk-Tuk Tracking API",
      version: "1.0.0",
      status: "running",
      timestamp: new Date().toISOString(),
    },
    "API is operational",
  );
});

// Health check / database diagnostics
app.get(`${API_PREFIX}/health`, async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbConnected = mongoose.connection.readyState === 1;

    console.log("🏥 Health check requested");
    console.log(
      "📊 DB Connection State:",
      mongoose.connection.readyState,
      dbConnected ? "(Connected)" : "(Disconnected)",
    );
    console.log(
      "🔌 Connection URI:",
      process.env.MONGODB_URI?.substring(0, 50) + "...",
    );

    const response = {
      status: "healthy",
      database: dbConnected ? "connected" : "disconnected",
      env: {
        has_mongodb_uri: !!process.env.MONGODB_URI,
        has_jwt_secret: !!process.env.JWT_SECRET,
        node_env: process.env.NODE_ENV,
        port: process.env.PORT,
      },
      timestamp: new Date().toISOString(),
      connectionState: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      }[mongoose.connection.readyState],
    };

    // Try to ping the database
    if (dbConnected) {
      try {
        const admin = mongoose.connection.db.admin();
        const pingResult = await admin.ping();
        response.ping = pingResult;
        console.log("✅ Database ping successful");
      } catch (pingError) {
        console.error("❌ Database ping failed:", pingError.message);
        response.ping_error = pingError.message;
      }
    }

    return sendSuccess(res, response, "Health check complete");
  } catch (error) {
    console.error("❌ Health check error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "HEALTH_CHECK_FAILED",
        message: error.message,
      },
    });
  }
});

// Authentication routes (no auth required for login/refresh)
app.use(`${API_PREFIX}/auth`, authRoutes);

// Province and district API routes (require authentication)
console.log("Province routes required");
console.log("Mounting province routes...");
app.use(`${API_PREFIX}/provinces`, provinceRoutes); // Temporarily remove middleware for testing
console.log("Province routes mounted");
app.use(`${API_PREFIX}/districts`, verifyTokenMiddleware, districtRoutes);
app.use(
  `${API_PREFIX}/police-stations`,
  verifyTokenMiddleware,
  policeStationRoutes,
);

// Vehicle and driver management routes (require authentication)
console.log("Mounting vehicle routes...");
app.use(`${API_PREFIX}/vehicles`, vehicleRoutes); // Temporarily remove middleware for testing
console.log("Vehicle routes mounted");
app.use(`${API_PREFIX}/drivers`, verifyTokenMiddleware, driverRoutes);

// Location tracking routes (require authentication)
app.use(`${API_PREFIX}/locations`, verifyTokenMiddleware, locationRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL ERROR HANDLER:", {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = {};
    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: errors,
      },
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_ENTRY",
        message: `A record with this ${field} (${value}) already exists`,
      },
    });
  }

  // Handle CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: `Invalid ${err.kind}: ${err.value}`,
      },
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "An internal server error occurred",
    },
  });
});

// 404 handler
app.use((req, res) => {
  console.log(
    `404 HANDLER: ${req.method} ${req.path} - Original URL: ${req.originalUrl}`,
  );
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// ==================== START SERVER ====================
// Only start the server locally, not on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`🚗 Tuk-Tuk Tracking API Server`);
    console.log(`📍 Running on: http://localhost:${PORT}`);
    console.log(
      `📚 API Documentation: http://localhost:${PORT}${API_PREFIX}/docs`,
    );
    console.log(
      `❤️  Health Check: http://localhost:${PORT}${API_PREFIX}/health`,
    );
    console.log(
      `🔐 Authentication: http://localhost:${PORT}${API_PREFIX}/auth/login`,
    );
    console.log(`${"=".repeat(50)}\n`);
  });
}

module.exports = app;
