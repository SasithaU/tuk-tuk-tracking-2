/**
 * Error Handler Utility
 * Handles different types of errors and provides detailed error messages
 */

const { sendError, sendValidationError } = require("./response");
const { ERROR_CODES, STATUS_CODES } = require("../constants");

/**
 * Handle Mongoose validation errors
 */
const handleMongooseValidationError = (error) => {
  const errors = {};

  if (error.errors) {
    Object.keys(error.errors).forEach((field) => {
      errors[field] = error.errors[field].message;
    });
  }

  return errors;
};

/**
 * Handle duplicate key errors
 */
const handleDuplicateKeyError = (error) => {
  try {
    if (error.keyValue && Object.keys(error.keyValue).length > 0) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return `A record with this ${field} (${value}) already exists`;
    }
  } catch (e) {
    console.error("Error handling duplicate key:", e);
  }
  return "A record with these values already exists";
};

/**
 * Process and send error response
 */
const processError = (res, error, defaultMessage = "An error occurred") => {
  try {
    const errorInfo = {
      name: error?.name || "Unknown",
      message: error?.message || "No message",
      code: error?.code || null,
      constructor: error?.constructor?.name || "Unknown",
    };

    console.error("❌ ERROR CAUGHT BY ERROR HANDLER:", errorInfo);
    console.error("📋 Full Error Object:", error);
    console.error("📚 Error Stack:", error?.stack);

    // Mongoose Validation Error
    if (error?.name === "ValidationError") {
      const validationErrors = handleMongooseValidationError(error);
      console.error("✅ Validation errors extracted:", validationErrors);
      return sendValidationError(res, validationErrors);
    }

    // Mongoose Duplicate Key Error
    if (error?.code === 11000) {
      const message = handleDuplicateKeyError(error);
      console.error("✅ Duplicate key error handled:", message);
      return sendError(
        res,
        ERROR_CODES.DUPLICATE_ENTRY,
        message,
        STATUS_CODES.CONFLICT,
      );
    }

    // Cast Error (invalid ObjectId)
    if (error?.name === "CastError") {
      console.error("✅ Cast error handled:", error.message);
      return sendError(
        res,
        ERROR_CODES.BAD_REQUEST,
        `Invalid ${error.kind}: ${error.value}`,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    // Network/Connection Error
    if (
      error?.message?.includes("ECONNREFUSED") ||
      error?.message?.includes("MongoDB")
    ) {
      console.error("✅ Database connection error handled");
      return sendError(
        res,
        ERROR_CODES.INTERNAL_ERROR,
        "Database connection failed. Please check your MongoDB connection string.",
        STATUS_CODES.INTERNAL_ERROR,
      );
    }

    // Generic error
    console.error("✅ Generic error response sent:", defaultMessage);
    return sendError(
      res,
      ERROR_CODES.INTERNAL_ERROR,
      defaultMessage,
      STATUS_CODES.INTERNAL_ERROR,
    );
  } catch (handlerError) {
    console.error("🔥 ERROR IN ERROR HANDLER ITSELF:", handlerError);
    // Fallback error response
    return sendError(
      res,
      ERROR_CODES.INTERNAL_ERROR,
      defaultMessage,
      STATUS_CODES.INTERNAL_ERROR,
    );
  }
};

module.exports = {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  processError,
};
