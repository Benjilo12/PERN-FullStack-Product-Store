import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productsController.js";
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.post("/:id", updateProduct);
router.post("/:id", deleteProduct);
// router.get("/");

export default router;
