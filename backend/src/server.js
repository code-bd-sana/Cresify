/**
 * @file server.js
 * @description Main server entry point for the Cresify backend application.
 *              Initializes the Express server and establishes database connection.
 * @module Server
 */

import { app } from "./app.js";
import connectDB from "./configure/db.js";

/**
 * Port number for the server to listen on.
 * Uses environment variable PORT if available, otherwise defaults to 5000.
 * @constant {number}
 */
const PORT = process.env.PORT || 5000;

/**
 * Start the Express server
 * Listens for incoming HTTP requests on the specified PORT.
 * Logs a confirmation message when the server starts successfully.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Initialize database connection
 * Connects to MongoDB using the configuration from connectDB.
 * This is called after the server starts listening to ensure
 * the application can handle requests even if DB connection is delayed.
 */
connectDB();
