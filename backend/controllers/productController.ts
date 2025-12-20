import asyncHandler from "../middleware/asyncHandler.ts";
import Products from "../models/productModel.ts";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Products.find({});
  res.json(products);
});

// @desc Fetch single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Resource not found");
    }
  } catch (error) {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export { getProducts, getProductById };
