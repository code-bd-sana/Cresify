/**
 * @file app.js
 * @description Express application configuration and middleware setup for Cresify backend.
 *              Configures CORS, body parsing, cookie handling, routing, and error handling.
 * @module App
 */

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import index from "../src/route/index.js";
import connectDB from "./configure/db.js";

/**
 * Express application instance
 * @type {express.Application}
 */
export const app = express();

/**
 * CORS Configuration
 * Allows cross-origin requests from specified origins.
 * Enables credentials (cookies, authorization headers) to be sent with requests.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS}
 */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cresify.vercel.app"],
    credentials: true,
  })
);

/**
 * Body Parser Middleware
 * Parses incoming JSON requests with a limit of 50MB to support base64-encoded images.
 * Base64 encoding increases file size by ~33%, so 15MB images become ~20MB.
 *
 * @see {@link https://expressjs.com/en/api.html#express.json}
 */
app.use(express.json({ limit: "50mb" }));

/**
 * URL-Encoded Parser Middleware
 * Parses incoming URL-encoded requests (form data) with a limit of 50MB.
 * Extended mode allows for rich objects and arrays to be encoded.
 *
 * @see {@link https://expressjs.com/en/api.html#express.urlencoded}
 */
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/**
 * Cookie Parser Middleware
 * Parses Cookie header and populates req.cookies with an object keyed by cookie names.
 * Used for session management and authentication.
 *
 * @see {@link https://www.npmjs.com/package/cookie-parser}
 */
app.use(cookieParser());

/**
 * API Routes
 * All application routes are prefixed with /api
 * Routes are defined in the index router which aggregates all route modules.
 *
 * @example
 * GET  /api/admin/blog
 * POST /api/admin/blog/save
 * PUT  /api/admin/blog/edit
 */
app.use("/api", index);

/**
 * Global Error Handling Middleware
 * Catches and handles all errors thrown in the application.
 * Provides specific handling for PayloadTooLargeError (413) and generic error handling.
 *
 * @param {Error} err - Error object
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next middleware function
 *
 * @returns {express.Response} JSON response with error details
 *
 * @example
 * // PayloadTooLargeError response
 * {
 *   success: false,
 *   message: "File size too large. Please upload an image smaller than 15MB.",
 *   error: "PayloadTooLargeError"
 * }
 *
 * @example
 * // Generic error response
 * {
 *   success: false,
 *   message: "Error message",
 *   error: "ErrorName"
 * }
 */
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle PayloadTooLargeError
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "File size too large. Please upload an image smaller than 15MB.",
      error: "PayloadTooLargeError",
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    error: err.name || "ServerError",
  });
});

/**
 * Initialize Database Connection
 * Establishes connection to MongoDB database.
 * Connection details are configured in the connectDB module.
 *
 * @see {@link ./configure/db.js}
 */
connectDB();
