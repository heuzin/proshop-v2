import path from "node:path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.ts";

import productRoutes from "./routes/productRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import orderRoutes from "./routes/orderRoutes.ts";
import uploadRoutes from "./routes/uploadRoutes.ts";

import { notFound, errorHandler } from "./middleware/errorMiddleware.ts";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); // Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
