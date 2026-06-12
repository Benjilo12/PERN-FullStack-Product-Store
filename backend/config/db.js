// Import Neon serverless PostgreSQL driver
import { neon } from "@neondatabase/serverless";
// Import dotenv to load environment variables
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Destructure database credentials from environment variables
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

/**
 * Create a SQL connection using Neon serverless PostgreSQL
 * Uses environment variables for secure credential management
 * Exports a tagged template literal function for safe SQL queries
 */
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
);

// The sql function exported here is used as a tagged template literal, which allows us to write queries safely
// This prevents SQL injection attacks by properly escaping variables
