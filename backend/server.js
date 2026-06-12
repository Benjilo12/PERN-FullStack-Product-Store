// Import required dependencies
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();
//? Initialize Express app and set the port from environment or default to 8000
const app = express();
const PORT = process.env.PORT || 8000;

//* ========== MIDDLEWARE SETUP ==========
//? Parse incoming JSON request bodies
app.use(express.json());

//? Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with backend
app.use(cors());

//? Helmet is a security middleware that protects the app by setting various HTTP headers
app.use(helmet());

//? Morgan logs HTTP requests to the console in development mode
app.use(morgan("dev"));

//* ========== ROUTES ==========
//? Root route - returns a simple greeting message
app.use("/api/products", productRoutes);

//* ========== DATABASE CONNECTION ==========
//?Store text (words), up to 255 characters long.”
async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS products ( 
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDB", error);
  }
}

//* ========== SERVER STARTUP ==========
//? Start the Express server and listen on the specified port
initDB().then(() => {
  app.listen(PORT, () => console.log("Server is running on port " + PORT));
});
