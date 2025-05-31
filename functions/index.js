import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import express from "express";
import cors from "cors";
import Stripe from "stripe";

// Initialize Firebase Admin
initializeApp();

// Create Express app
const app = express();

// Set global options (v2 syntax)
setGlobalOptions({
  region: "us-central1",
  maxInstances: 10,
  memory: "1GiB",
  timeoutSeconds: 60,
});

// Middleware
// With this:
const allowedOrigins = [
  "https://amazon-fronend-deployment.netlify.app",
  "http://localhost:3000", // for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: ${origin} not allowed`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // if you need cookies/auth headers
  })
);
app.use(express.json());

// Health check
app.get("/_health", (req, res) => res.status(200).send("OK"));

// Routes
app.get("/", (req, res) => {
  res.send("✅ Firebase Cloud Function is running");
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_your_key", {
  apiVersion: "2023-08-16",
});

// Payment endpoint
app.post("/payment/create", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Convert dollars to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Export the API (v2 syntax)
export const api = onRequest(app);
