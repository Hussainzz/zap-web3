import * as dotenv from "dotenv";
dotenv.config({path: "../../.env"});
import app from "./app";

let server: any = null;

async function initializeApp() {}

initializeApp()
  .then(() => {
    // Start Server
    const port = process.env.PORT || 8001;
    server = app.listen(port, () => {
      console.log(`Running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server?.close(() => {
    process.exit(1);
  });
});

// Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err?.message);
  server?.close(() => {
    process.exit(1);
  });
});
