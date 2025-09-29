import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { errorHandler } from "@/middleware/error-handler";
import { notFound } from "@/middleware/not-found";
import authRoutes from "@/routes/auth";
import erpBatchesRoutes from "@/routes/erp/erp-batches";
import erpDailyLogsRoutes from "@/routes/erp/erp-daily-logs";
import erpPackagingRoutes from "@/routes/erp/erp-packaging";
import erpFinishedGoodsRoutes from "@/routes/erp/erp-finished-goods";
import erpWasteRoutes from "@/routes/erp/erp-waste";
import erpReviewRoutes from "@/routes/erp/erp-review";
import erpStrainsRoutes from "@/routes/erp/erp-strains";
import erpGrowthCyclesRoutes from "@/routes/erp/erp-growth-cycles";
import qmsRoutes from "@/routes/qms";
import auditRoutes from "@/routes/audit";
import { initializeSupabase } from "@/services/supabase";

// Load environment variables
dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
initializeSupabase();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:8080",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
	message: {
		error: "Too many requests from this IP, please try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
} else {
	app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
		version: "1.0.0",
	});
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/erp/batches", erpBatchesRoutes);
app.use("/api/v1/erp/daily_logs", erpDailyLogsRoutes);
app.use("/api/v1/erp/packaging", erpPackagingRoutes);
app.use("/api/v1/erp/finished_goods", erpFinishedGoodsRoutes);
app.use("/api/v1/erp/waste", erpWasteRoutes);
app.use("/api/v1/erp/waste_management", erpWasteRoutes); // Alias to match frontend API_ROUTES
app.use("/api/v1/erp/review", erpReviewRoutes);
app.use("/api/v1/erp/strains", erpStrainsRoutes);
app.use("/api/v1/erp/growth_cycles", erpGrowthCyclesRoutes);
app.use("/api/v1/qms", qmsRoutes);
app.use("/api/v1/audits", auditRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Environment: ${process.env.NODE_ENV}`);
	console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
