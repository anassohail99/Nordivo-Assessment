import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import showtimeRoutes from "./routes/showtime.routes";
import reservationRoutes from "./routes/reservation.routes";
import seatRoutes from "./routes/seat.routes";
import addOnRoutes from "./routes/addOn.routes";

import { errorHandler, notFound } from "./middleware/error.middleware";

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use("/api/", limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/addons", addOnRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
