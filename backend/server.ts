import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "./config.env" });
const DB = (process.env.DATABASE_LINK ? process.env.DATABASE_LINK : "").replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : ""
);
mongoose
  .connect(DB)
  .then(() => console.log("connected to MongoDB..."));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

process.on("unhandledRejection", (err: any) => {
  console.log("\nUNHANDLED REJECTION! Shutting down...\n");
  console.log(err.name, err.message, "\n");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process Terminated!");
  });
});
