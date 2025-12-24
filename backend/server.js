import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.ts";
import { notFound, errorHandler } from "./middleware/errorMiddleware.ts";
import productRoutes from "./routes/productRoutes.ts";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
