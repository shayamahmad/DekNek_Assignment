/**
 * Run from server folder: npm run test:db
 * Verifies MongoDB credentials and prints success or Atlas error text.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";

try {
  await connectDB();
  const name = mongoose.connection.db?.databaseName;
  console.log("\n✓ Database reachable. Using database:", name ?? "(default)");
  await mongoose.disconnect();
  process.exit(0);
} catch {
  process.exit(1);
}
