import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import authRoutes from "./routes/auth";
import clientsRoutes from "./routes/clients";
import dispatchesRoutes from "./routes/dispatches";
import inventoryRoutes from "./routes/inventory";
import suppliersRouter from "./routes/suppliers";
import purchaseOrdersRouter from "./routes/purchase_orders";
import { initializeSupabase } from "./services/supabase";

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
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
app.use("/api/v1/clients", clientsRoutes);
app.use("/api/v1/dispatches", dispatchesRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/suppliers", suppliersRouter);
app.use("/api/v1/purchase-orders", purchaseOrdersRouter);

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
