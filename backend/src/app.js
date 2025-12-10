import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import index from "../src/route/index.js";
import connectDB from "./configure/db.js";

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://cresify.vercel.app"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

app.use("/api", index);

// Error handling middleware
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

connectDB();
