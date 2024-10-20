import express, { Application, NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PrismaClient } from "@prisma/client";

const app: Application = express();
const prisma = new PrismaClient();

export const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://rydleap-dashboard.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware setup
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Polling-Quiz-Bidding Server is running",
  });
});

// Router setup
app.use("/api/v1", router);

// Global Error Handler
app.use(GlobalErrorHandler);

// API Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
