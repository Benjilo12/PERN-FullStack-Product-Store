// Import the SQL database connection
import { sql } from "../config/db.js";

/**
 * GET /api/products
 * Retrieves all products from the database, ordered by creation date (newest first)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProducts = async (req, res) => {
  try {
    // Query the database to get all products ordered by creation date
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC`;

    // Return products with success status
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    // Handle errors and return 500 status
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/products
 * Creates a new product in the database
 */
export const createProduct = async (req, res) => {
  // Extract product details from request body
  const { name, price, image } = req.body;

  // Validate that all required fields are provided
  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Insert new product into database and return the created product
    const newProduct = await sql`
    INSERT INTO products (name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *`;

    // Log new product for debugging
    console.log("new product added:", newProduct);

    // Return the newly created product (Note: should be 201 Created, not 500)
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/products/:id
 * Retrieves a single product by ID from the database

 */
export const getProduct = async (req, res) => {
  // Extract product ID from URL parameters
  const { id } = req.params;

  try {
    // Query the database for product with matching ID
    const product = await sql`
    SELECT * FROM products WHERE id=${id}`;

    // Return the found product (Note: should check if product exists first)
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in getProduct", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * POST /api/products/:id
 * Updates an existing product by ID with new data
 *
 */
export const updateProduct = async (req, res) => {
  // Extract product ID from URL parameters
  const { id } = req.params;

  // Extract updated product fields from request body
  const { name, price, image } = req.body;

  try {
    // Update product in database with new values
    const updatedProduct = await sql`
    UPDATE products
    SET name=${name}, price=${price}, image=${image}
    WHERE id=${id}
    RETURNING *`;

    // Check if product was found and updated
    if (updatedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Return the updated product
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * DELETE /api/products/:id
 * Deletes a product from the database by ID
 
 */
export const deleteProduct = async (req, res) => {
  // Extract product ID from URL parameters
  const { id } = req.params;

  try {
    // Delete product from database and return the deleted product data
    const deletedProduct = await sql`
    DELETE FROM products WHERE id=${id} RETURNING *`;

    // Check if product was found and deleted
    if (deletedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Return success with deleted product data
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
