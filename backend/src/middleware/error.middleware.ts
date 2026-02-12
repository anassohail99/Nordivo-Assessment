import { Response } from "express";

export const errorHandler = (err: any, res: Response): void => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (res: Response): void => {
  res.status(404).json({ error: "Route not found" });
};
