import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { getAuth } from "firebase-admin/auth";

// Initialize configuration
dotenv.config();

// Initialize Firebase Admin
initializeApp();

// Create Express app
const app = express();

// Global function configuration
setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 60,
  memory: "1GiB",
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://amazon-fronend-deployment.netlify.app",
];

// Handle preflight requests
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Apply CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Route logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

// Payment endpoint - matches frontend expectation
app.post("/payment/create", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Successful response
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      error: "Payment processing failed",
      message: error.message,
    });
  }
});

// Authentication middleware
app.use(async (req, res, next) => {
  const publicEndpoints = ["/health", "/payment/create"];
  if (publicEndpoints.includes(req.path)) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    await getAuth().verifyIdToken(token);
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
});

// Export the API
export const api = onRequest(app);
