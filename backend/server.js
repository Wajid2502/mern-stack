import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Product from "./models/product.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json()); // Allow us to accept JSON data in the req.body

//Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    // Inspect products in console to check if it's being retrieved correctly
    console.log("Products fetched:", products);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(`Error in fetching products: ${error.stack}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

//create New Product
app.post("/api/products", async (req, res) => {
  const product = req.body; // user will send this data
  if (!product.image || !product.name || !product.price) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  const newProduct = new Product(product);
  try {
    await newProduct.save();
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.log(`Error in create product ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

//Update Product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Error While updating product", error.message);
  }
});

//Delete Single Product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.log("Error in deleting product", error.message);
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
});

app.listen(5001, () => {
  connectDB();
  console.log("Server started at http://localhost:5001 Hello wajidsss");
});
// 8GXnHICCY7NaSm3B
// mongodb+srv://wajidkhan2502:<db_password>@cluster0.pq0vy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
