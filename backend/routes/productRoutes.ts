import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/productController.ts";
import { protect, admin } from "../middleware/authMiddleware.ts";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById);

export default router;
