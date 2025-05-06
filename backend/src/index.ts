import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDatabase, disconnectFromDatabase } from "./lib/db";
import AuthRoute from "./routes/Auth.Route";
import UserRoute from "./routes/User.Route";
import cookieParser from "cookie-parser";
import { Server } from "http";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoute.router);
app.use("/api/user", UserRoute.router);

const PORT = process.env.PORT || 5001;

/**
 *  Health check route, used to check if the server is running.
 * */
app.get("/health", (req, res) => {
  res.send("Hello World!");
});

let server: Server;
const startServer = async () => {
  try {
    await connectToDatabase();
    server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", stopServer);
    process.on("SIGTERM", stopServer);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error starting server:", error.message);
    } else {
      console.error("Error starting server:", error);
    }
    process.exit(1); // Exit the process if the server fails to start
  }
};

const stopServer = async () => {
  console.log("Stopping server gracefully...");
  if (server) {
    server.close((err) => {
      if (err) {
        console.error("Error stopping server:", err);
      } else {
        console.log("Server stopped gracefully.");
      }
    });
  }

  await disconnectFromDatabase();
  process.exit(0); // Exit the process after stopping the server
};

startServer();
