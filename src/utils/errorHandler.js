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
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  return `A record with this ${field} (${value}) already exists`;
};

/**
 * Process and send error response
 */
const processError = (res, error, defaultMessage = "An error occurred") => {
  console.error("Error details:", {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
  });

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    const validationErrors = handleMongooseValidationError(error);
    console.error("Validation errors:", validationErrors);
    return sendValidationError(res, validationErrors);
  }

  // Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const message = handleDuplicateKeyError(error);
    return sendError(
      res,
      ERROR_CODES.DUPLICATE_ENTRY,
      message,
      STATUS_CODES.CONFLICT,
    );
  }

  // Cast Error (invalid ObjectId)
  if (error.name === "CastError") {
    return sendError(
      res,
      ERROR_CODES.BAD_REQUEST,
      `Invalid ${error.kind}: ${error.value}`,
      STATUS_CODES.BAD_REQUEST,
    );
  }

  // Generic error
  return sendError(
    res,
    ERROR_CODES.INTERNAL_ERROR,
    defaultMessage,
    STATUS_CODES.INTERNAL_ERROR,
  );
};

module.exports = {
  handleMongooseValidationError,
  handleDuplicateKeyError,
  processError,
};
