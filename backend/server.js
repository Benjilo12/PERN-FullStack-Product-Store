// Import required dependencies
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import path from "path";

dotenv.config();
//? Initialize Express app and set the port from environment or default to 8000
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

//* ========== MIDDLEWARE SETUP ==========
//? Parse incoming JSON request bodies
app.use(express.json());

//? Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with backend
app.use(cors());

//? Helmet is a security middleware that protects the app by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

//? Morgan logs HTTP requests to the console in development mode
app.use(morgan("dev"));

//apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Request",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot access denied" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed(),
      )
    ) {
      return res.status(403).json({ error: "Spoofed bot detected" });
    }
    next();
  } catch (error) {
    console.log("Arcjet error", error);
  }
});

//* ========== ROUTES ==========
//? Root route - returns a simple greeting message
app.use("/api/products", productRoutes);

//!for production after building the app
if (process.env.NODE_ENV === "production") {
  //server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

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
